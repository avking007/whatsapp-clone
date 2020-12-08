const mongo = require('mongoose');
const config = require('./default');

const connect = async () => {
  try {
    mongo.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('db connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
