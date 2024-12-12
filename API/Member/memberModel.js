const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../config/db');
const QuotationModel=require('../Quotation/QuotationModel');
const bcrypt = require('bcryptjs');

class Member extends Model {}

Member.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    mobile_no: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
},
{
    sequelize,
    modelName: "Member",
    tableName: "members",
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
});


QuotationModel.belongsTo(Member,{foreignKey:'member_id',as:'members'});
Member.hasMany(QuotationModel,{foreignKey:'member_id',as:'quotations'});

module.exports = Member;