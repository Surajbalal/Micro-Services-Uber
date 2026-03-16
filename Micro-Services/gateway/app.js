const express = require('express');
const expressProxy = require('express-http-proxy');

const cors = require("cors");

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use('/users',expressProxy('http://localhost:3001'))
app.use('/captain',expressProxy('http://localhost:3002'))
app.use('/rides',expressProxy('http://localhost:3003'))

app.listen(3000,()=>{

    console.log('Gateway server is listening on port 3000');

})