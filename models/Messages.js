const mongo = require('mongoose');

const messageSchema = mongo.Schema({
  room: {
    type: mongo.Schema.Types.ObjectId,
    ref: 'rooms',
  },
  msg_contents: [
    {
      user: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      uid: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
});

module.exports = Message = mongo.model('messages', messageSchema);
