const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = {
  googlePass: function (passport) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          const newUser = {
            userId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            image: profile.photos[0].value,
          };
          try {
            let user = await User.findOne({ userId: profile.id });
            if (user) {
              done(null, user);
            } else {
              user = await User.create(newUser);
              done(null, user);
            }
          } catch (err) {
            console.error(err);
          }
        }
      )
    );
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => done(err, user));
    });
  },
  githubPass: function (passport) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: '/auth/github/callback',
        },

        async (accessToken, refreshToken, profile, done) => {  
             
          const newUser = {
            userId: profile.id,
            displayName: profile.displayName,
            firstName: profile.username,
            image: profile.photos[0].value,
          };
          try {
            let user = await User.findOne({ userId: profile.nodeId });
            if (user) {
              done(null, user);
            } else {
              user = await User.create(newUser);
              done(null, user);
            }
          } catch (err) {
            console.error(err);
          }
        }
      )
    );
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => done(err, user));
    });
  },
};
