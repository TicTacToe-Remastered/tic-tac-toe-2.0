const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = User;