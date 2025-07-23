const { generateRandomString } = require("eb-butler-utils");
const keys_length = require("../../config/config.json").keys_length;
const config = require("../../config/config.json");
// let keys_length = require("./../config/keys_length");
module.exports = function (sequelize, DataTypes) {
    let Model = sequelize.define("authorizations", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            defaultValue: null,
            field: 'user_id',
            references: {
                model: "users",
                key: "id"
            },
            validate: {
                notEmpty: { args: true },
                isInt: true,
                min: 1
            }
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'access_token',
            defaultValue: null,
            validate: {
                notEmpty: true
            }
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            field: 'refresh_token',
            validate: {
                notEmpty: true
            }
        },
        deviceType: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            field: 'device_type',
        },
        deviceToken: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            field: 'device_token',
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            field: 'platform',
        }
    }, {
        tableName: "authorizations"
    }, {
        instanceMethods: {
            generateAccessToken: function () {
                return this.accessToken = generateRandomString(keys_length.access_token, config.char_set);
            }
        }
    });
    //--//
    Model.prototype.generateAccessToken = function () {
        this.accessToken = generateRandomString(keys_length.access_token, config.char_set);
    };
    
    Model.prototype.generatePasswordToken = function () {
        this.refreshToken = generateRandomString(keys_length.refresh_token, config.char_set);
    };
    return Model;
};
