const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../../config/db');
const Modelname = require('../ModelNames/modelName');

class Colorname extends Model { }

Colorname.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      tableName: 'modelnames',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  color: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  price:{
    type: DataTypes.BIGINT,
    allowNull: true
  },
  variantId:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  other: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
},
{
  sequelize,
  modelName: "Colorname",
  tableName: "colornames",
  timestamps: true,
});




module.exports = Colorname;
