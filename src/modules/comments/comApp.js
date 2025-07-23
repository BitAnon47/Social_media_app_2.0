const express = require('express');
const commentRoutes = require('./routes/rtComments');
const app = express();

app.use('/', commentRoutes);

module.exports = app;

    