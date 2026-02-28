
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors());

app.use('/' ,userRoutes);



module.exports = app;