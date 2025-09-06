const router = require('express').Router()
const { body } = require('express-validator');
const {adminLogin,addAnime,addGenre,addEpisodes,addCharacters,getReports,rejectReport,resolveReport} = require('../controller/AdminCont');
const AdminAuth = require('../middleware/adminAuth');

router.post('/login',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required')
    ]
    , adminLogin);
router.post('/addAnime', AdminAuth, addAnime);
router.post('/addGenre', AdminAuth, addGenre);
router.post('/addEpisodes', AdminAuth, addEpisodes);
router.post('/addCharacters', AdminAuth, addCharacters);
router.get('/getReports', AdminAuth, getReports);
router.post('/rejectReport/:reportId', AdminAuth, rejectReport);
router.post('/resolveReport/:reportId', AdminAuth, resolveReport);

module.exports = router;
