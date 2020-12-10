const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Messages');

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
      let messageModel = new Message();

      // create room
      const newRoom = { title };
      if (desc) {
        newRoom.desc = desc;
      }
      newRoom.user = req.user.id;
      let member = [];
      member.push({ user: req.user.id });
      newRoom.members = member;
      newRoom.messageModel = messageModel.id;
      const room = new Room(newRoom);
      messageModel.room = room.id;
      await room.save();

      // save the new message model
      await messageModel.save();

      // add group to creator's participant
      let creator = await User.findById(req.user.id).select('-password');
      creator.participant.push({ room: room.id });
      await creator.save();

      res.json({ messageModel, room });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error.');
    }
  }
);

// route room/:gid/add_img
// access private
//desc  add image of group
router.put(
  '/:gid/add_img',
  [auth, [check('image', 'Image is Required').not().isEmpty()]],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: err.array() });
    }
    try {
      const { image } = req.body;
      const gid = req.params.id;
      // get the room and add img
      let room = await Room.findById(gid);
      room.image = image;
      await room.save();
      res.send(room);
    } catch (error) {
      if (error.kind == 'ObjectId') {
        return res.status(400).send('No such group exists.');
      } else {
        console.log(error);
        res.status(500).send('Server error');
      }
    }
  }
);

// route room/:gid/message
// access private
//desc  add message in group
router.put('/:gid/message', [
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
      const gid = req.params.gid;
      // get user email
      const { message, name } = req.body;
      let newMessage = { message, user: name };

      //   get group by id
      let group = await Room.findById(gid).select('messageModel');

      // get message model of that group and add message to it
      let messageModel = await Message.findById(group.messageModel);
      messageModel.msg_contents.push(newMessage);

      await messageModel.save();
      res.json({ messageModel, group });
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
      let user = await User.findOne({ email }).select(['_id', 'participant']);
      if (!user) {
        return res.status(400).json({ msg: 'No such user exists.' });
      }
      //   if valid then add member
      let newMember = { user };
      //   get group by id
      let group = await Room.findById(gid);
      //   push member to group
      group.members.push(newMember);

      // push group to user participant
      user.participant.push({ room: gid });

      await group.save();
      await user.save();
      res.json(group);
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
