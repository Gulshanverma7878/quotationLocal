const VariantController=require('./variantController');
const express = require('express');
const router = express.Router();

router.post('/',VariantController.CreateVariant);
router.get('/',VariantController.getAllVariants);
router.get('/:id',VariantController.getByModelId);


module.exports=router;
