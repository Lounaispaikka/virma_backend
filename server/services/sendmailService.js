const db = require('../../db');
const Model = require('../../db');
const config = require('../../config.js');

const nodemailer = require('nodemailer');
const sendmailTransport = require('nodemailer-sendmail-transport');
const fs = require('fs');
const Handlebars = require('handlebars');

function sendMailNewUser(info) {
  if (info.message === 'Success') {
    fs.readFile(__dirname + '/../../emailTemplates/newUserCreated.html', 'utf-8', (error, emailTemplate) => {
      if (error) { throw error; }
      const templateData = { user: info.user };
      const template = Handlebars.compile(emailTemplate);
      const htmlBody = template(templateData);
      const subject = 'Uusi käyttäjä on kirjautunut Virma-sovelluksen käyttäjäksi';

      Model.users.findAll({ where: { admin: true } })
        .then(result => {
          result.forEach(user => { sendMail(user.email, subject, htmlBody); });
        });
    });
  }
}

function sendAccessRequestNotification(info) {
  fs.readFile(__dirname + '/../../emailTemplates/newAccessRequest.html', 'utf-8', (error, emailTemplate) => {
    if (error) { throw error; }
    const templateData = { user: info.user };
    const template = Handlebars.compile(emailTemplate);
    const htmlBody = template(templateData);
    const subject = '[Virma] Uusia oikeuspyyntöjä';

    Model.users.findAll({ where: { admin: true } })
      .then(result => {
        result.forEach(user => { sendMail(user.email, subject, htmlBody); });
      });
  });
}

function sendMailForgotPassword(url, userEmail) {
  fs.readFile(__dirname + '/../../emailTemplates/passwordForgot.html', 'utf-8', (error, emailTemplate) => {
    if (error) { throw error; }
    const templateData = { url: url };
    const template = Handlebars.compile(emailTemplate);
    const htmlBody = template(templateData);
    const subject = 'Virma-sovelluksen salasanan palautus';

    sendMail(userEmail, subject, htmlBody);
  });
}

function sendMailPasswordChanged(username, userEmail) {
  fs.readFile(__dirname + '/../../emailTemplates/passwordChanged.html', 'utf-8', (error, emailTemplate) => {
    if (error) { throw error; }
    const templateData = { username: username };
    const template = Handlebars.compile(emailTemplate);
    const htmlBody = template(templateData);
    const subject = 'Virma-sovelluksen salasanasi on vaihdettu';

    sendMail(userEmail, subject, htmlBody);
  });
}

function sendMail(to, subject, html) {
  const transporter = nodemailer.createTransport(sendmailTransport({ path: '/usr/sbin/sendmail' }));

  const mailOptions = {
    from: config.senderEmail,
    to: to,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error("sendMail failed",error);
    } else {
      console.log('Email sent');
    }
  });
}

module.exports = {
  sendMailForgotPassword: sendMailForgotPassword,
  sendMailNewUser: sendMailNewUser,
  sendMailPasswordChanged: sendMailPasswordChanged,
  sendAccessRequestNotification: sendAccessRequestNotification
};
