const { DataTypes, Model } = require('sequelize')
const sequelize = require("../../../config/db");
const VariantModel = require('../variants/variantModel');
const Colorname = require('../colors/ColorModel');
const AccessoriesModel = require('../Accessories/AccessoriesModel');
const InsuranceModel = require('../Insurance/InsuranceModel');
const VASModel = require('../VAS/VASModel');

class Modelname extends Model { }

Modelname.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ppl: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fuel_type:{
    type:DataTypes.STRING(100),
    allowNull:true
  },
  variant:{
    type:DataTypes.STRING(100),
    allowNull:true
  },
  Corporate_Offer_Top:{
    type:DataTypes.STRING(100),
    allowNull:true
  },
  price: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Ex_Showroom_Price:{
    type:DataTypes.BIGINT,
    allowNull:true
  },
  RTO_Normal: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  Manufacturing_Year:{
    type:DataTypes.STRING(10),
    allowNull:true
  },
  VC_Code:{
    type:DataTypes.STRING(100),
    allowNull:true
  },
  quantity: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  additional: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  Insurance_Id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  VAS_Id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  by: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Corporate_Offer: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  RTO_Normal_scrap: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  RT_BH:{
    type:DataTypes.BIGINT,
    allowNull:true
  },
  RT_TRC:{
    type:DataTypes.BIGINT,
    allowNull:true
  },
  // insurance:{
  //   type:DataTypes.BIGINT,
  //   allowNull:true
  // }

},
{
  sequelize,
  modelName: "Modelname",
  tableName: "modelnames",
  timestamps: true,
});

VariantModel.belongsTo(Modelname, { 
  foreignKey: 'modelId',
  as: 'modelnames'  
});


Modelname.hasMany(VariantModel, { 
  foreignKey: 'modelId',
  as: 'variants'
});


Colorname.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(Colorname, {
  foreignKey: 'modelId',
  as: 'colors'
});

AccessoriesModel.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(AccessoriesModel, {
  foreignKey: 'modelId',
  as: 'accessories'
});


InsuranceModel.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(InsuranceModel, {
  foreignKey: 'modelId',
  as: 'insurances'
});

VASModel.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(VASModel, {
  foreignKey: 'modelId',
  as: 'vas'
});

module.exports = Modelname;