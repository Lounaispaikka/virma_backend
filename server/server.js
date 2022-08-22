const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../config.js');
const api = require('./api');
const dbService = require('./services/dbService.js');

const app = express();

const port = 8081;

app.use(helmet());


const whitelist = [config.directUrl, 'https://127.0.0.1','http://127.0.0.1','http://127.0.0.1:8080', 'https://[::1]', 'https://localhost', 'http://localhost:8080','http://[::1]:8080'];

  
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else if (origin) {
      console.log(origin);
      callback(new Error('Not allowed by CORS'))
    } else {
      callback(null, true)
    }
  },
  methods: ['GET', 'POST'],
  allowHeaders: ['Origin, Content-Type, Accept, Authorization, Cache'],
  exposedHeaders: ['X-Requested-With'],
  credentials: true,
}));

// Template rendering
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Utils (post body parsing, cmd logging)
app.use(morgan(':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(cookieParser(config.sessionSecret));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// Session handling
// TODO: https://www.npmjs.com/package/connect-pg-simple
app.use(session({
  secret: config.sessionSecret,
  cookie: { maxAge: 3600000, sameSite: process.env.NODE_ENV === 'development'? "none":"lax" }, // 1 hour cookie
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Server api routes
app.use('/api', api);

/*app.get('/testerror', function (req, res) {
  throw new Error('BROKEN') // Express will catch this on its own.
});*/

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Apply db services
//dbService.sync(); // when creating new tables
dbService.initDbCleanup();
dbService.scheduleLoginCleanup();

module.exports = app;
