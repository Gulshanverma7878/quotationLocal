const express=require('express');
const router=express.Router();
const InputController=require('./InputController');

router.post('/',InputController.create);
router.get('/',InputController.getAll);
router.get('/:id',InputController.getById);
router.put('/:id',InputController.update);
router.delete('/:id',InputController.delete);



module.exports=router;