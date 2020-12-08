const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const hasher = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/default');
// route  api/signup
// access public
// desc  signup user
router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Enter strong password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ messsage: err.array() });
    }
    const { name, email, password } = req.body;

    // check existing user so error
    try {
      const x = await User.findOne({ email });
      if (x) {
        return res.status(400).json({ msg: 'User already exists.' });
      } else {
        const user = { name, email, password };
        const salt = await hasher.genSalt(10);
        user.password = await hasher.hash(password, salt);
        const newUser = new User(user);
        await newUser.save();
        // jwt
        const payload = {
          user: {
            id: newUser.id,
          },
        };
        jwt.sign(
          payload,
          config.jwtKey,
          {
            expiresIn: '10h',
          },
          (err, token) => {
            if (err) throw err;
            return res.json({ token });
          }
        );
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// route api/login
// access public
// desc login
router.post(
  '/login',
  [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Enter valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: err.array() });
    }

    const { email, password } = req.body;

    // check user is present
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist.' });
      }
      const match = hasher.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ msg: 'Invalid email or password' });
      } else {
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(payload, config.jwtKey, { expiresIn: '10h' }, (err, token) => {
          if (err) throw err;
          return res.json({ token });
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Sever error.');
    }
  }
);

module.exports = router;
