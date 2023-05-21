const path = require('path');
require('dotenv').config({path: './.env'});
const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');
// db connect
connectDB();

// middleware
app.use(express.json({ extended: false }));

// routes
app.use(cors());
app.use('/user/', require('./routes/user'));
app.use('/room/', require('./routes/room'));
app.use('/uploads/users/', express.static('./uploads/users'));
app.use('/uploads/rooms/', express.static('./uploads/rooms'));

if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('whatsapp-clone/build'));

  app.use('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'whatsapp-clone', 'build', 'index.html')
    );
  });
}
// define port
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
