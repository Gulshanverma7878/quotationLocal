const express=require('express');
const router=express.Router();
const InputController=require('./InputController');

router.post('/',InputController.create);
router.get('/',InputController.getAll);
router.get('/detail/:id',InputController.getById);
router.put('/:id',InputController.update);
router.delete('/:id',InputController.delete);
router.post('/hpns',InputController.createHPN);
router.get('/hpns',InputController.getAllHPN);
router.get('/hpns/:id',InputController.getByIdHPN);
router.put('/hpns/:id',InputController.updateHPN);
router.delete('/hpns/:id',InputController.deleteHPN);



module.exports=router;