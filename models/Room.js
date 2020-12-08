const mongo = require('mongoose');

const RoomSchema = new mongo.Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: mongo.Schema.Types.ObjectId,
    ref: 'users',
  },
  image: {
    type: String,
    default:
      'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  messages: [
    {
      user: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'users',
      },
      message: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  members: [
    {
      user: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
});

module.exports = Room = mongo.model('room', RoomSchema);
