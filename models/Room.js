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
  desc: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  messageModel: {
    type: mongo.Schema.Types.ObjectId,
    ref: 'messages',
  },
  members: [
    {
      user: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'users',
      },

      name: {
        type: String,
      },
    },
  ],
});

module.exports = Room = mongo.model('room', RoomSchema);
