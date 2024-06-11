const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");

const product = require('./routes/productRoutes.js');
const user = require('./routes/userRoutes.js');
const acc = require('./routes/accountRoutes.js');

const errorMiddleware = require('./middlewares/error.js');

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "50mb"
}));
app.use(cors({
  credentials: true,
  origin: true
}));

// Routes

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', acc);

// Middleware

app.use(errorMiddleware);

module.exports = app;