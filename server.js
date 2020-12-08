const express = require('express');
const connectDB = require('./config/db');
const app = express();
// middleware
app.use(express.json({ extended: false }));

// db connect
connectDB();

// define port
const PORT = process.env.PORT || 5000;

// routes
app.use('/user/', require('./routes/user'));
app.use('/room/', require('./routes/room'));

app.listen(PORT, () => console.log('working'));
