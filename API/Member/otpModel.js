const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../config/db');
const { tableName } = require('./memberModel');

class OTP extends Model { }

OTP.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mobile_no: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: true,
    }
},
    {
        sequelize,
        modelName: 'Otp',
        tableName: 'otp',
        timestamps: true
    }

)

module.exports = OTP;