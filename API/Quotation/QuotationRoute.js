const QuotationController=require('./QuotationController');
const express=require('express');
const router=express.Router();


router.get('/',QuotationController.get);
router.post('/',QuotationController.Create);
router.delete('/:id',QuotationController.deleteQuotation);
router.put('/:id',QuotationController.updateQuotation);


module.exports=router;
