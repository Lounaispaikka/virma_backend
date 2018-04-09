const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Config files for the PostgreSQL server running on the azure server
const config = require('../config.js');

// Configure sequelize to the PostgreSQL database
const sequelize = new Sequelize(config.db, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  operatorsAliases: Op,
  pool: {
    max: 100,
    min: 0,
    idle: 10000
  }
});

// Check if connection can be established to database
sequelize.authenticate().then(() => {
  console.log('Database connection success');
}).catch((err) => {
  console.log('Database connection failed', err);
});

const db = {};

// This is for making the different models accessible from the module exports of ./models.'name of the model'
fs
  .readdirSync(__dirname + '/models')
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    const model = sequelize.import(path.join(__dirname + '/models', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
