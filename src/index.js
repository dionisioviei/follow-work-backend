const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const mongodbURL = require('./config').mongoUrl;

const app = express();

var port = process.env.PORT || 3333;

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port);
