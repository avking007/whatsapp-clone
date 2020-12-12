const mongo = require('mongoose');

const UserSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  participant: [
    {
      room: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'room',
      },
      grp_img: {
        type: String,
      },
      title: {
        title: String,
      },
    },
  ],
});

module.exports = User = mongo.model('user', UserSchema);
