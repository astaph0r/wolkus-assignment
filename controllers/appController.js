const Post = require('../models/Post');
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const Comment = require("../models/Comment");
const passport = require('passport');
const bcrypt = require("bcryptjs");
// const { post } = require('../routes');
require('dotenv').config({ path: '.env' });

// GET all posts

exports.getAllPlaylist = async (req, res) => { 
  const playlists = await Playlist.find({userID: req.user.userID})
      .limit(100)
      .sort({ createdAt: -1 });
  console.log(req.user);
  res.render('home', {
      title: "Home",
      small: "For All Your Playlists",
      styles: ['simple-sidebar'],
      posts: playlists,
      libs: ['sidebar'],
      username: req.user.username
  })
};


exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/login');
};

exports.forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/home');      
};

exports.ensureAuthorized = async (req, res, next) => {
  const postID = req.params.postID;
  const post = await Post.find({_id: postID});
  const originalUser = post[0].username;

  if (req.user.username == originalUser) {
    return next();
  }
  req.flash('error_msg', 'You don\'t have the access to modify this post');
  res.redirect('/post/'+postID);
};



exports.getPlaylist = async (req, res,) => {
  try {
    const playlist = await Post.find({_id: req.params.id});
    if (!playlist.public && req.user.id!=playlist.userID) {
      throw new Error('Unauthorized');
    }
    // const comments = await Comment.find({postID: req.params.id})
    playlist.sort({ createdAt: -1 });
    res.render('post', {
      styles: ['simple-sidebar','post'],
      post: post[0],
      comments: comments,
      libs: ['sidebar'],
      username: req.user.username
    })
  } catch (error) {
    req.flash(
      'error_msg',
      'The playlist doesn\'t exist'
    );
    res.redirect('/home');
  }
};

exports.getCategoryPosts = async (req, res,) => {

    const posts = await Post.find({category: req.params.category})
    .limit(100)
    .sort({ createdAt: -1 });
    
    res.render('home', {
      title: req.params.category,
      small: "",
      styles: ['simple-sidebar'],
      posts: posts,
      libs: ['sidebar'],
      username: req.user.username
  })
};

exports.getUserProfile = async (req, res,) => {
  try {
    const user = await User.find({username: req.params.username});
    const playlists = await Playlist.find({username: req.params.username})
    .sort({ createdAt: -1 });
    const filteredPlaylists = playlists.filter((pl)=> {return pl.public || req.user._id==pl.userID})
    res.render('userprofile', {
      styles: ['simple-sidebar'],
      user: user[0],
      playlists: filteredPlaylists,
      libs: ['sidebar'],
      username: req.user.username
    })
  } catch (error) {
    req.flash(
      'error_msg',
      'The user doesn\'t exist'
    );
    res.redirect('/home');
  }
};



// POST register

exports.register = (req, res) => {
  
  const {
      fullname,
      email,
      username,
      password,
      password2
  } = req.body;
  const dob = new Date(req.body.dob);
  let errors = [];

  if (!fullname || !dob || !username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (username.length > 25) {
    errors.push({ msg: 'Username cannot exceed 25 characters' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      fullname,
      username,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          fullname,
          username,
          email,
          password,
          password2
        });
      } else {
        User.findOne({ username: username }).then(user => {
          if (user) {
            errors.push({ msg: 'Username not available! Try a different username' });
            res.render('register', {
              errors,
              email,
              fullname,
              password,
              password2
            });
          } else {
            const newUser = new User({
              fullname,
              email,
              username,
              dob,
              password
            });

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    })
  }
};


exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',  
    failureFlash: true
  })(req, res, next);
};


// POST logout

exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
};

// POST an update to the database

exports.createPlaylist = (req, res) => {
  
  const {
    title,
    playlistID
    } = req.body;
  let errors = [];
  const userID = req.user._id;
  // console.log(req.user);

  let playlist = Playlist.findById(playlistID);
  if (playlist.userID!=userID) {
    errors.push({ msg: 'Unauthorized.' });
  }

  
  if ( !username || !title || !postBody || !category) {
    errors.push({ msg: 'Please enter all fields' });
  }
 
};



