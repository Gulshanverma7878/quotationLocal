const express = require('express');
const router = express.Router();
const ModelController=require('./modelController');

router.post('/',ModelController.CreateModelName);
router.get('/',ModelController.getAllModelNames);
router.get('/for/:id',ModelController.getById);
router.get('/detail/:id',ModelController.getallDetail);
router.put('/:id',ModelController.UpdateModel);
router.post('/excel',ModelController.excel);
router.delete('/:id',ModelController.deleteModel);


module.exports = router;