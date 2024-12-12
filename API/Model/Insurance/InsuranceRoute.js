const InsuranceController=require('./InsuranceController');
const express = require('express');
const router = express.Router();

router.post('/',InsuranceController.CreateInsurance);
router.get('/',InsuranceController.getAllInsurances);
router.get('/:id',InsuranceController.getByModelId);
router.post('/excel/:id',InsuranceController.excel);


module.exports=router;
