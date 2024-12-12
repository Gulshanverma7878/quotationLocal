const ColorController=require('./ColorController');
const express = require('express');
const router = express.Router();

router.post('/',ColorController.CreateColor);
router.get('/',ColorController.getAllColors);
router.get('/:id',ColorController.getByModelId);
router.put('/:id',ColorController.UpdateColor);
router.delete('/:id',ColorController.deleteColor);
router.get('/variant/:id',ColorController.getByVariantId);


module.exports=router;
