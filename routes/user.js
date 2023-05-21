const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const hasher = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/users');
  },
  filename: function (req, file, cb) {
    cb(null, req.params.uid + '.jpeg');
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb('Enter JPEG file only!', false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

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
  const { tokenId } = req.body;
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
        let newMem = { email, name };
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
          process.env.JWT_KEY,
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
          process.env.JWT_KEY,
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
  '/:uid/add_image',
  [auth, upload.single('user_image')],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ msg: error.array() });
    }
    try {
      res.json(req.file);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
