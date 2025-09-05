const router = require('express').Router()
const adminCtrl = require('../controller/AdminCont');

router.post('/addAnime',adminCtrl.addAnime);
module.exports = router;
