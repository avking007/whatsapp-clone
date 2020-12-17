const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');
// middleware
app.use(express.json({ extended: false }));

// db connect
connectDB();

// define port
const PORT = process.env.PORT || 5000;

// routes
app.use(cors());
app.use('/user/', require('./routes/user'));
app.use('/room/', require('./routes/room'));
app.use('/uploads/users/', express.static('./uploads/users'));
app.use('/uploads/rooms/', express.static('./uploads/rooms'));
app.listen(PORT, () => console.log('working'));
