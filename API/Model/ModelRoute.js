const express=require('express');
const router=express.Router();
const ModelRoute=require('./ModelNames/modelRoute');
const VariantRoute=require('./variants/variantRoute');
const VASRoute=require('./VAS/VASRoute');
const ColorRoute=require('./colors/ColorRoute');
const AccessoriesRoute=require('./Accessories/AccessoriesRoute');
const InsuranceRoute=require('./Insurance/InsuranceRoute');

router.use('/',ModelRoute);

router.use('/variant',VariantRoute);
router.use('/vas',VASRoute);
router.use('/color',ColorRoute);
router.use('/accessories',AccessoriesRoute);
router.use('/insurance',InsuranceRoute);

module.exports=router;