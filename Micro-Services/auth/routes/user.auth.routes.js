const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/register',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullName.firstName').isLength({min:4}).withMessage("First name should"),
    body('password').isLength({min:6}).withMessage("Password should be at least 6 character long")
],
userController.registerUser
);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 character long ')
],userController.loginUser
);

router.get('/refresh-token',userController.refreshToken);


router.get('/logOut',authMiddleware,userController.logoutUser);
router.get('/logout-all',authMiddleware,userController.logoutAllUser)
router.post('/verify-emial',userController.verifyEmail);
module.exports = router;