const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../../config/db');
const Modelname = require('../ModelNames/modelName');

class Accessories extends Model { }

Accessories.init({
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
  AccessoryName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  price:{
    type: DataTypes.BIGINT,
    allowNull: true
  },
  other: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
},
{
  sequelize,
  modelName: "Accessorie",
  tableName: "accessories",
  timestamps: true,
});




module.exports = Accessories;
