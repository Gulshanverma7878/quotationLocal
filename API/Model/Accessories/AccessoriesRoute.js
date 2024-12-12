const AccessoriesController=require('./AccessoriesController');
const express = require('express');
const router = express.Router();

router.post('/',AccessoriesController.CreateAccessories);
router.get('/',AccessoriesController.getAllAccessoriess);
router.get('/:id',AccessoriesController.getByModelId);
router.delete('/:id',AccessoriesController.deleteAccessories);
router.put('/:id',AccessoriesController.updateAccessories);


module.exports=router;
