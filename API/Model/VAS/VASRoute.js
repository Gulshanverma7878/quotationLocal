const VASController=require('./VASController');
const express = require('express');
const router = express.Router();

router.post('/',VASController.CreateVAS);
router.get('/',VASController.getAllVASs);
router.get('/:id',VASController.getByModelId);
router.put('/:id',VASController.updateVAS);
router.delete('/:id',VASController.deleteVAS);
router.post('/excel/:id',VASController.excel);


module.exports=router;
