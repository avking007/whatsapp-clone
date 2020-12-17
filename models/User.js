const mongo = require('mongoose');

const UserSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
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

      title: {
        type: String,
      },
    },
  ],
});

module.exports = User = mongo.model('user', UserSchema);
