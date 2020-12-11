const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const hasher = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/default');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  '699625891152-llvk17ddp5otqeqc1076gcid8ipidtsr.apps.googleusercontent.com'
);
// route  user/auth
// access private
// desc  get user details by id
router.get('/auth', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// route user/googlelogin
// access public
// desc google login/signup
router.post('/googlelogin', async (req, res) => {
  const { tokenId, img } = req.body;
  try {
    const match = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        '699625891152-llvk17ddp5otqeqc1076gcid8ipidtsr.apps.googleusercontent.com',
    });
    const { email_verified, name, email } = match.payload;
    if (email_verified) {
      let user = await User.findOne({ email }).select('-password');
      if (!user) {
        // create user and send token
        let newMem = { email, name, image: img };
        const password = '`cFt`7//E' + email + 'Z^eeXq=h#';
        const salt = await hasher.genSalt(10);
        newMem.password = await hasher.hash(password, salt);

        const newUser = new User(newMem);
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
            return res.json({
              token,
              user: {
                _id: newUser.id,
                name,
                email,
                image: img,
                participant: newUser.participant,
              },
            });
          }
        );
      } else {
        // send token
        const payload = {
          user: {
            id: user._id,
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
            return res.json({ token, user });
          }
        );
      }
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// route user/add_img
// access private
// add dp
router.put(
  '/add_image',
  [auth, [check('image', 'Image is required').not().isEmpty()]],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: error.array() });
    }
    try {
      const { image } = req.body;
      let user = await User.findById(req.user.id);
      user.image = image;
      await user.save();
      res.send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
