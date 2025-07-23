const express = require("express");
const publicRoutes = require("./routes/rtUsers").public;
const protectedRoutes = require("./routes/rtUsers").protected;

module.exports = function({ publicOnly, protectedOnly } = {}) {
    const router = express.Router();
    if (publicOnly) {
        router.use("/", publicRoutes);
    } else if (protectedOnly) {
        router.use("/", protectedRoutes);
    } else {
        router.use("/", publicRoutes);
        router.use("/", protectedRoutes);
    }
    return router;
};
