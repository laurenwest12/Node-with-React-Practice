const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        //we already have an instance for this user id
        done(null, existingUser);
      } else {
        // we don't have an instance with this user id so make a new instance
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      }
    }
    // (accessToken, refreshToken, profile, done) => {
    //   User.findOne({ googleId: profile.id })
    //   .then((existingUser) => {
    //     if (existingUser) {
    //       //we already have an instance for this user id
    //       done(null, existingUser);
    //     } else {
    //       // we don't have an instance with this user id so make a new instance
    //       new User({ googleId: profile.id })
    //         .save()
    //         .then((user) => done(null, user));
    //     }
    //   });
    // }
  )
);
