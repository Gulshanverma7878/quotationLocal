const { DataTypes, Model } = require('sequelize')
const sequelize = require("../../../config/db");

class InputModel extends Model { }
InputModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fastag: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    fastag_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    TCS: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    TCS_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    Scrap_Certificate: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    Scrap_Certificate_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    other: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

}, {
    sequelize,
    modelName: "InputModel",
    tableName: "inputs",
    timestamps: true,
});

module.exports = InputModel;