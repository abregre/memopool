const express = require('express');
const passport = require('passport');
const router = express.Router();

//@desc Auth with Google
//@route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
//@desc Google Auth Callback
//@route GET /auth/dashboard
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);


//@desc Auth with Github
//@route GET /auth/github
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);
//@desc Github Auth Callback
//@route GET /auth/dashboard
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
   (req, res)=>res.redirect('/dashboard')  
);

//@desc Logout user
//@route /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
