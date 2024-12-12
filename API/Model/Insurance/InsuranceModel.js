const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../../config/db');
const Modelname = require('../ModelNames/modelName');

class Insurance extends Model { }

Insurance.init({
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
  insurance_Name: {
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
  modelName: "Insurance",
  tableName: "insurances",
  timestamps: true,
});




module.exports = Insurance;
