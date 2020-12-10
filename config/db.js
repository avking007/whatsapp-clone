const mongo = require('mongoose');
const config = require('./default');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1120371',
  key: '59140e79370d6491a60f',
  secret: '10a87abd59fd11b13522',
  cluster: 'ap2',
  useTLS: true,
});

const connect = async () => {
  try {
    mongo.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    // pusher
    const db = mongo.connection;
    db.once('open', () => {
      console.log('db connected');
      const messages = db.collection('messages');
      const changestream = messages.watch();

      changestream.on('change', (change) => {
        // console.log(change);
        if (change.operationType == 'update') {
          const msg_model = change.documentKey;
          const changed = change.updateDescription.updatedFields;
          let data = {};
          for (let key in changed) {
            if (key.startsWith('_')) continue;
            else {
              data['new_msg'] = changed[key];
            }
          }
          pusher.trigger('messages', 'updated', {
            data: data['new_msg'],
            msg_model,
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
