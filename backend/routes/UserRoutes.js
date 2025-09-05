const router = require('express').Router();
const {body} = require('express-validator');
const {register,login,getMe} = require ("../controller/AdminCont");
const auth = require('../middleware/UserAuthen');

router.post('/register',
    [
        body('username').isLength({min:3}),
        body('email').isEmail(),
        body('password').isLength({min:3}),
    ],
    register
);

router.post('/login',
    [
        body("email").isEmail(),
        body("password").exists(),
    ],
    login
);
router.get("/me",auth,getMe);
module.exports = router;