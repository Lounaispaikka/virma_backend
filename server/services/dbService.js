const cron = require('node-cron');

const db = require('../../db');
const Model = require('../../db');
const { Op } = require("sequelize");

exports.sync = function() {
  db.sequelize.sync({
    force: false,
    alter: false
})
}

exports.initDbCleanup = function () {
  // On server start set everything to null or 0
  Model.users.findAll().then((users) => {
    users.forEach((user) => {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.failedLoginAttempts = 0;
      user.failedLoginTime = null;

      user.save();
    });
  });

  console.log('Initial user table cleanup executed');
}

exports.scheduleLoginCleanup = function () {
  // Cron schedule for resetting login attempts and times every 2 minutes

  cron.schedule('*/2 * * * *', () => {
    Model.users.findAll({
      where: {
        failedLoginAttempts: {
          [Op.gt]: 0
        }
      }
    }).then((users) => {
      var cleanup = false;
      users.forEach((user) => {
        user.failedLoginAttempts = 0;
        user.failedLoginTime = null;

        user.save();

        if (!cleanup) {
          cleanup = true;
          console.log('Running failed login cleanup');
        }

      });

    });

  });
}
