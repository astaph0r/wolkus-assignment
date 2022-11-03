const router = require('express').Router();
const Post = require('../models/Post');
const appController = require('../controllers/appController');

router.get('/home',
    appController.ensureAuthenticated,
    appController.getAllPlaylist   
);

router.get('/',
    appController.forwardAuthenticated,
    (req, res) => {
    res.render('welcome')
});

//login handle
router.get('/login',
    appController.forwardAuthenticated, (req,res) => {
    res.render('login')
});

router.get('/register',
    appController.forwardAuthenticated, (req,res) => {
    res.render('register', {
        title: 'register',
        libs: ['register']
    })
});

router.get('/playlists/:id',
    appController.ensureAuthenticated,
    appController.getPlaylist
);

router.get('/user/:username',
    appController.ensureAuthenticated,
    appController.getUserProfile 
);

// register for a username
router.post(
    '/register',
    appController.register
);

router.post(
    "/login",
    appController.login
);


// Logout
router.get('/logout', appController.logout);

router.post(
    '/create',
    appController.createPlaylist
);

module.exports = router;
