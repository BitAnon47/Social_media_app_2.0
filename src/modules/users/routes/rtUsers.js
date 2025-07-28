const express = require("express");
const commonController = require("../controllers/ctrlUsers");
const userRules = require('../validations/valUser');
const Validation = require('../validations/validation');
// const verifyToken = require('../../../../middleware/verifyAuth');
// const roles = require('../../../../middleware/roles');
// const verifyAuth  = require('../../../../middleware/verifyAuth');

// --- Public Router ---

const publicRouter = express.Router({ mergeParams: true });
publicRouter.post("/create", userRules.rule('create'), Validation.validate, commonController.create);
publicRouter.post("/login", userRules.rule('login'), Validation.validate, commonController.login);
publicRouter.post("/forgotPassword", userRules.rule('forgotPassword'), commonController.forgotPassword);
publicRouter.post("/updatePassword", userRules.rule('updatePassword'), commonController.updatePassword);
publicRouter.post("/getAllUsers", commonController.getAllUsers);
publicRouter.post("/getUserTotalCount", commonController.getUserTotalCount);
publicRouter.post("/Refresh-Token",commonController.refreshToken);
// --- Protected Router ---
const protectedRouter = express.Router({ mergeParams: true });
protectedRouter.post("/update",commonController.update);
protectedRouter.post("/updateEmail",userRules.rule('updateEmail', 'generateAccessToken'), commonController.updateEmail);
protectedRouter.post("/get-user",commonController.getUser);

protectedRouter.post('/soft-delete',commonController.softDeleteUser);

module.exports = {
  public: publicRouter,
  protected: protectedRouter
};
