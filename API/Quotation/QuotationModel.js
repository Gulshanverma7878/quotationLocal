const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../config/db');

class QuotationModel extends Model {}

QuotationModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    modelnames: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    Ex_Showroom_Price: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    modelprice:{
        type:DataTypes.BIGINT,
        allowNull:true,
    },
    fuel: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    variantname: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    colorname: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    accessories: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    vas: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    // insurance: {
    //     type: DataTypes.STRING(100),
    //     allowNull: true,
    // },
    price: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    additionalDiscount:{
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    scrapCertificate: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    scrap_exchange: {
        type: DataTypes.ENUM('Yes', 'No'),
        allowNull: true,
    },
    scrapCertificatePrice: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    RTOType: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    RTOTypePrice: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    RTO_Normal: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    RTO_Normal_scrap: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    RTO_BH:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RTO_TRC:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    TCS_price: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    additional:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    billing_price:{
        type: DataTypes.BIGINT,
        allowNull: true
    },

    insurances: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    insurancesPrice: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    RASPrice: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    RAS: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    // HPNPrice: {
    //     type: DataTypes.BIGINT,
    //     allowNull: true,
    // },
    HPN: {
        type: DataTypes.STRING(300),
        allowNull: true,
    },
    insurance_by:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    billing_price:{
        type: DataTypes.BIGINT,
        allowNull: true
    },
    // // // // // key_replacement:{
    // // // // //     type: DataTypes.STRING(100),
    // // // // //     allowNull: true
    // // // // // },
    // // // // // engine_protection:{
    // // // // //     type: DataTypes.BIGINT,
    // // // // //     allowNull: true
    // // // // // },
    // // // // RTI:{
    // // // //     type: DataTypes.BIGINT,
    // // // // },
    // // // tyreAndOthers: {
    // // //     type: DataTypes.BIGINT,
    // // //     allowNull: true
    // // // },
    // // consumable:{
    // //     type: DataTypes.BIGINT,
    // //     allowNull: true
    // // },
    // personal_beloging:{
    //     type:DataTypes.BIGINT,
    // },
    // bettery_protection:{
    //     type:DataTypes.BIGINT,

    // },
    fastag:{
        type:DataTypes.BIGINT,
    },
    customer_name:{
        type:DataTypes.STRING(100),
        allowNull:true  
    },
    customer_mobile_no:{
        type:DataTypes.STRING(12),
        allowNull:true
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            tableName: 'members',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    status: {
        type:DataTypes.ENUM('Pending','Approved','Rejected'),
        allowNull:true,
        defaultValue:'Pending',
    },
    QuotationType:{
        type:DataTypes.STRING(200),
        allowNull:true,
    },
    finalDealAmount:{
        type:DataTypes.BIGINT,
        allowNull:true
    }
},{

    sequelize,
    modelName: 'Quotation',
    tableName: 'quotations',
    timestamps: true

});



module.exports=QuotationModel;