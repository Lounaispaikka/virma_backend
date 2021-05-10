const bcrypt = require('bcryptjs');
const moment = require('moment');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(passport, users) {
  const User = users;

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id: id } }).then((user) => {
      if (!user) { return done(null, false); }
      return done(null, user);
    }).catch((err) => {
      return done(err);
    });
  });

  passport.use(new BasicStrategy((username, password, done) => {
    User.findOne({ where: { username: username } }).then((user) => {
      if (!user) { return done(false, { message: 'Unknown user' }); }

      // Cron task resets this every 2 minutes
      if (user.failedLoginAttempts > 5) {
        return done(false, { message: 'Account is locked' });
      }

      // Compare password hash to the sequelize defined user password hash
      const openHash = bcrypt.compareSync(password, user.password);

      if (!openHash) {
        user.failedLoginAttempts = user.failedLoginAttempts + 1;
        user.failedLoginTime = moment().utcOffset(120).format();

        user.save().then(() => {
          return done(false, { message: 'Invalid password' });
        });
      }

      if (openHash) {
        user.failedLoginAttempts = 0;
        user.failedLoginTime = null;

        user.save().then(() => {
          return done(user, { message: 'Success', user: user.username, admin: user.admin });
        });
      }
    }).catch((err) => {
      return done(err);
    });
  }));

  passport.use('local-signup', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        return done(null, false, { message: 'Email has already been assigned to a user' });
      }

      User.findOne({ where: { username: username } }).then((user) => {
        if (user) {
          return done(null, false, { message: 'Username has been taken' });
        } else {
          if (password !== req.body.password2) {
            return done(null, false, { message: 'Second password does not match' });
          } else if (req.body.email === "") {
            return done(null, false, { message: 'Email was empty' });
          } else {
            // Create password hash with 10 rounds
            var hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            var newUser = User.create({
              name: req.body.name,
              username: username,
              password: hashPass,
              email: req.body.email,
              phone: req.body.phone,
              organization: req.body.organization,
              updater_id: username.replace(/ /g,'') // Just to be sure...
            });

            return done(null, newUser, { message: 'Success', user: username, admin: false });
          }
        }
      }).catch((err) => {
        return done(err);
      });
    }).catch((err) => {
      return done(err);
    });
  }));
}
