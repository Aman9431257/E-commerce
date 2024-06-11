const app = require('./app');
const express = require('express');
const path = require('path');
const connect = require('./db/database.js');
const cloudinary = require("cloudinary");
var history = require('connect-history-api-fallback');

connect();

const PORT = 5000;

app.use(history({
  index: '/index.html'
}));
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

cloudinary.config({
  cloud_name: "dah3fitqz",
  api_key: "536677949597188",
  api_secret: "mbA95sfoeUwssFGOC56IPrMwbSY"
});

app.listen(PORT, () => {
  console.log(`Server is working`);
});