const router = require('express').Router();
const {body} = require('express-validator');
const {register,login,getMe,updateMe,deleteMe,logout,showUserAnimeList,addToAnimeList,updateAnimeList,removeFromAnimeList,userPrefrence,getUserPrefrence,registerReport} = require ("../controller/UserCont");
const auth = require('../middleware/UserAuthen');

router.post('/register',
    [
    body('username')
      .exists().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    body('email')
      .exists().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),

    body('password')
      .exists().withMessage("Password is required")
      .isLength({ min: 3 }).withMessage("Password must be at least 3 characters")
   ],
    register
);

router.post('/login',
    [
    body('email')
      .exists().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),

    body('password')
      .exists().withMessage("Password is required")
      .isLength({ min: 3 }).withMessage("Password must be at least 3 characters")
    ],
    login
);
router.get("/me",auth,getMe);
router.put("/me",auth,updateMe);
router.delete("/me",auth,deleteMe);
router.post("/logout",auth,logout);
router.get("/list",auth,showUserAnimeList);
router.post("/list",auth,addToAnimeList);
router.patch("/list/:animeId",auth,updateAnimeList);
router.delete("/list/:animeId",auth,removeFromAnimeList);
router.post("/preference",auth,userPrefrence);
router.get("/preference",auth,getUserPrefrence);
router.post('/report/:item_type/:item_id', auth,registerReport);

module.exports = router;