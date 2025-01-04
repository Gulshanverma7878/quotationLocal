const express = require('express');
const router = express.Router();
const ModelController=require('./modelController');

router.post('/',ModelController.CreateModelName);
router.get('/getnames',ModelController.GetNames);
router.get('/',ModelController.getAllModelNamesCache);//getAllModelNames
router.get('/cache',ModelController.getAllModelNamesCache);//
router.get('/:id',ModelController.getById);
router.get('/detail/:id',ModelController.getallDetail); //cache 
router.put('/:id',ModelController.UpdateModel);
router.post('/excel',ModelController.excel);
router.delete('/:id',ModelController.deleteModel);
router.get('/search/:columnName/:name',ModelController.searchModel);
router.get('/search/varientcolor/:variant/:color',ModelController.searchColorByVariant);


module.exports = router;