const crypto = require("crypto");
module.exports = function (sequelize, DataTypes)
 {
    let isUnique = function (field)
     {
        return function (value, next) {
            let Model = sequelize.models.users;
            let query = {};
            query[field] = value;
            Model.findOne({
                where: query,
                attributes: ["id"]
            }).then(function (obj) {
                
                if (obj && obj.id) { next(field + ": '" + value + "' is already taken"); }
                else { next(); }
            });
        };
    };
    let Model = sequelize.define("users",
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                field: 'id'
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
                field: 'name'
            },
            profileImage: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'profile_image'
            },
            email: {
                type: DataTypes.STRING,
                unique: { args: true },
                allowNull: false,
                defaultValue: "",
                validate: {
                    isEmail: true,
                    isUnique: isUnique("email")
                },
                field: 'email'
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'user_name'
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'phone'
            },

            password: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'passWord'
            },
            confirmPassword: {
                type: DataTypes.VIRTUAL,
                allowNull: true,
                defaultValue: null,
                validate: {
                    notEmpty: true
                }
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'active'
            },
        }, {
        tableName: "users",
        validate: {
            bothPasswordsEquals: function () {
                if (this.changed("password")) {
                    if (this.password !== this.confirmPassword) { throw Error("Password and Confirm Password should be equal"); }
                }
            }
        },
    });



    
    //--//
    Model.prototype.toJSON = function (options) {
        let attributes = Object.assign({}, this.get());
        delete attributes.password;
        delete attributes.confirmPassword;
        return attributes;
    };
    Model.prototype.hashPassword = function () {
        if (this.password) { this.password = crypto.createHash("sha1").update(this.password).digest("hex"); }
    };
    Model.prototype.hashConfirmPassword = function () {
        if (this.confirmPassword) { this.confirmPassword = crypto.createHash("sha1").update(this.confirmPassword).digest("hex"); }
    };
    Model.prototype.validatePassword = function (password) {
        password = String(password).trim();
        let passwordHash = crypto.createHash("sha1").update(password).digest("hex");
        let hashedPassword = String(this.password).trim();
        return (passwordHash === hashedPassword);
    };  
    return Model;
};
