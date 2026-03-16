const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();

const cookieParser = require('cookie-parser');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');


// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// ROUTES
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use('/', rideRoutes);
app.use('/maps', mapsRoutes);


module.exports = app;