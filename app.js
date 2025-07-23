const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment");
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const { request_getters, request_parser, not_found, allowed_methods } = require('eb-butler-utils')
const common = require('./helpers/common')
const constants = require('./config/constants.json')
const { tokenBucketLimiter} = require('./middleware/rateLimiter/rateLimter.js');
const verifyAuth = require('./middleware/verifyAuth');


//------------------------------------//
const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));

app.options("*", cors({ optionsSuccessStatus: 200 }));
//------------------------------------//
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
//global level rate limiting
 app.use(tokenBucketLimiter());
//------------------------------------//
app.use("/uploads", express.static(__dirname + "/uploads"));

//------------------------------------//
const console_stamp = require("console-stamp");
console_stamp(console, {
    pattern: "YYYY-MM-DD HH:mm:ss",
    formatter: function () { return moment().format("YYYY-MM-DD HH:mm:ss"); }
});
//allow methods for postman
app.use(allowed_methods);
//------------------------------------//
morgan.token("date", function () {
    return moment().format("YYYY-MM-DD HH:mm:ss");
});
morgan.token("status", function (req, res) {
    const status = (typeof res.headersSent !== "boolean" ? Boolean(res._header) : res.headersSent) ? res.statusCode : undefined;
    const color = status >= 500 ? 31 : status >= 400 ? 33 : status >= 300 ? 36 : status >= 200 ? 32 : 0;
    return `\x1b[${color}m${status}\x1b[0m`;
});


app.use(morgan("[:date] [:method] :url :status :res[content-length] - :response-time ms"));
//------------------------------------//
app.use(request_getters);
app.use(request_parser);
//-Here we are getting the language from the request and align the request response acccording with that -//
app.use(common.languageSet)

//------------------------------------//

app.post('/user/health', function (req, res, next) {
    console.log('health is fine');
    res.json(new Date())
})
app.use(function (req, res, next) {
    console.log("======> req.orgignalUrl : ", req.originalUrl);
    next();
});

//--------Modules route redirecting here for the request---------//
// Mount public user routes first (no auth)
app.use("/api/v1/user", require("./src/modules/users/userApp.js")({ publicOnly: true }));

// Apply global auth middleware
app.use(verifyAuth);

// Mount protected user routes (auth required)
app.use("/api/v1/user", require("./src/modules/users/userApp.js")({ protectedOnly: true }));
app.use("/api/v1/posts", require("./src/modules/posts/postApp.js")());
app.use("/api/v1/comments", require("./src/modules/comments/comApp.js"));
//app.use("/api/v1/likes", require("./src/modules/likes/app.js"));  
app.use("/api/v1/files", require("./src/modules/files/fileApp.js")());



//------------------------------------//
app.use(not_found);
app.use(require("./middleware/response_handler"));
//------------------------------------//
const os = require("os");


//------------------------------------//
const sequelize = require('./db/sequelize/sequelize');


// console.log("Server host", os.hostname());
//console.log("database host", sequelize.connection.config.host);



//Here We are building the sequelize Db connection
sequelize.connection.authenticate().then(async function () {
    // console.log("DB Connection Successful");
    //Sync the db tables with the models here 
    await sequelize.connection.sync({alter:true})
    app.listen(process.env.PORT, async function (error) {
        if (error) { console.log("Server is not listening...", error); }
        else {
            console.log("DB connected & Server is listening on HOST", os.hostname(), "on PORT", process.env.PORT);
        }
    });
}).catch(function (error) { console.log("Unable to connect to database", error); });
//------------------------------------// 
module.exports = app;
