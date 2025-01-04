const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../../config/db');

class HPNList extends Model {}

HPNList.init({
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hpn:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    other:{
        type:DataTypes.STRING(100),
        allowNull:true
    }
},{
    sequelize,
    modelName:'HPNList',
    tableName:'hpn_list',
    timestamps:false
})

module.exports = HPNList