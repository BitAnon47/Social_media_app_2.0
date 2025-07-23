const express = require('express');
const likeRoutes = require('./routes/rtLikes');
const app = express();

app.use('/api/likes', likeRoutes);

module.exports = app;