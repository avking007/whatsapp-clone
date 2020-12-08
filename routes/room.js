const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const User = require('../models/User');

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
      const newRoom = { title };
      if (desc) {
        newRoom.desc = desc;
      }
      newRoom.user = req.user.id;
      let member = [];
      member.push({ user: req.user.id });
      newRoom.member = member;
      const room = new Room(newRoom);
      await room.save();
      res.json({ newRoom });
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
      let room = await Room.findById(req.params.gid);
      room.image = image;
      await room.save();
      res.send(room);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// route room/:gid/message
// access private
//desc  add message in group
router.put('/:gid/message', [
  auth,
  [check('message', 'Message is required').not().isEmpty()],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: err.array() });
    }
    try {
      // get gid
      const gid = req.params.gid;
      // get user email
      const { message } = req.body;
      let newMessage = { message, user: req.user.id };
      //   get group by id
      let group = await Room.findById(gid);
      //   push member
      group.messages.push(newMessage);
      await group.save();
      res.json(group);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
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
      let user = await User.findOne({ email }).select('_id');
      if (!user) {
        return res.status(400).json({ msg: 'No such user exists.' });
      }
      //   if valid then add member
      let newMember = { user };
      //   get group by id
      let group = await Room.findById(gid);
      //   push member
      group.members.push(newMember);
      await group.save();
      res.json(group);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  },
]);

module.exports = router;
