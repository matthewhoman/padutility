/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const url = require('url');
const fs = require('fs');
const path = require('path');
const encoding = 'utf8';
const port = process.env.PORT || 1337;
const isDev = port === 1337 ? true : false;
const base64 = require('base-64');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, function () {
  console.log('Listening on port ' + port + '!');
});