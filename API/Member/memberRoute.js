const MemberController=require('./memberController');
const express = require('express');
const router = express.Router();

router.post('/',MemberController.createMember);
router.post('/login',MemberController.loginMember);
router.post('/otp',MemberController.otp);
router.post('/verify-otp',MemberController.verifyOtp);
router.get('/',MemberController.getAllMembers);
router.get('/:id',MemberController.getById);

module.exports=router;
