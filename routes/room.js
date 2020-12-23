const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Messages');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/rooms');
  },
  filename: function (req, file, cb) {
    cb(null, req.params.gid + '.jpeg');
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    // accept
    cb(null, true);
  } else {
    // reject
    cb(new Error('Can store only JPEG files.'), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// route room/group_cr
// access private
// desc group create
router.post(
  '/group_cr',
  [auth, [check('title', 'Group title is required').not().isEmpty()]],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: err.array() });
    }
    try {
      const { title, desc } = req.body;
      // create message model
      let creator = await User.findById(req.user.id).select('-password');

      let messageModel = new Message();

      // create room
      const newRoom = { title };
      if (desc) {
        newRoom.desc = desc;
      }

      newRoom.creator = req.user.id;
      let member = [];
      member.push({
        user: req.user.id,
        name: creator.name,
      });
      newRoom.members = member;
      newRoom.messageModel = messageModel.id;
      const room = new Room(newRoom);
      messageModel.room = room.id;
      await room.save();

      // save the new message model
      await messageModel.save();

      // add group to creator's participant
      creator.participant.push({
        room: room.id,
        title,
      });

      await creator.save();
      res.json({ creator, gid: room.id });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error.');
    }
  }
);

// route room/:gid/delete
// access private
//desc  delete group
router.delete('/:gid/delete', auth, async (req, res) => {
  // get group
  try {
    let group = await Room.findById(req.params.gid);
    if (!group) {
      return res.status(400).send('No such group exists.');
    }
    if (group.creator != req.user.id) {
      return res.status(401).send('Access Denied');
    }

    // remove message model of this group
    let messageModel = group.messageModel;
    await Message.deleteOne({ _id: messageModel });

    // remove members of that group
    let members = group.members;
    for (let i = 0; i < members.length; i++) {
      let member = members[i];
      let tempUser = await User.findById(member.user).select('participant');
      const removeIdx = tempUser.participant
        .map((group) => {
          group.room;
        })
        .indexOf(req.params.gid);
      tempUser.participant.splice(removeIdx, 1);
      await tempUser.save();
    }

    // remove group
    let user = await User.findById(req.user.id).select('-password');
    await group.deleteOne({ _id: req.params.gid });
    res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
});

// route room/:gid
// access private
//desc  get group by id
router.get('/:gid', auth, async (req, res) => {
  const gid = req.params.gid;
  try {
    let room = await Room.findById(gid);
    let msg_model = await Message.findById(room.messageModel);
    res.json({ room, msg_model });
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(404).send('Group not found');
    }
    return res.status(500).send('Server Error.');
  }
});

// route room/:gid/add_img
// access private
//desc  add image of group
router.put(
  '/:gid/add_image',
  [auth, upload.single('room_image')],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: err.array() });
    }
    try {
      res.json(req.file);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// route room/:mid/message
// access private
//desc  add message in group
router.put('/:mid/message', [
  auth,
  [
    check('message', 'Message is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: err.array() });
    }
    try {
      // get gid
      const mid = req.params.mid;
      // get user email
      const { message, name } = req.body;
      let newMessage = { message, user: name, uid: req.user.id };

      // get message model of that group and add message to it
      let messageModel = await Message.findById(mid);
      messageModel.msg_contents.push(newMessage);

      await messageModel.save();
      res.json(messageModel.msg_contents[messageModel.msg_contents.length - 1]);
    } catch (error) {
      if (error.kind == 'ObjectId') {
        return res.status(400).send('No such group exists.');
      } else {
        console.log(error);
        res.status(500).send('Server error');
      }
    }
  },
]);

// route room/:gid/add_member
// access private
// add participant in group
router.put('/:gid/add_member', [
  auth,
  [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: err.array() });
    }
    try {
      // get gid
      const gid = req.params.gid;
      // get user email
      const { email } = req.body;
      //check valid user
      let user = await User.findOne({ email }).select(['-password']);
      if (!user) {
        return res.status(400).json({ msg: 'No such user exists.' });
      }
      //   if valid then add member
      let newMember = { user: user._id, name: user.name };
      //   get group by id
      let group = await Room.findById(gid);
      //   push member to group
      if (!group) {
        return res.status(404).json('No such group found');
      }
      group.members.push(newMember);

      // push group to user participant
      user.participant.push({
        room: gid,
        title: group.title,
      });

      await group.save();
      await user.save();
      res.json({
        group: group.members[group.members.length - 1],
      });
    } catch (error) {
      if (error.kind == 'ObjectId') {
        return res.status(400).send('No such group or member exists.');
      } else {
        console.log(error);
        res.status(500).send('Server error');
      }
    }
  },
]);

module.exports = router;
