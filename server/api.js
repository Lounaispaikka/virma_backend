const api = module.exports = require('express').Router();

const points = require('./routes/points');
const routes = require('./routes/routes');
const areas = require('./routes/areas');
const login = require('./routes/login');
const manage = require('./routes/manage');
const reset = require('./routes/reset');
const features = require('./routes/features');

api.use('/points', points);
api.use('/routes', routes);
api.use('/areas', areas);
api.use('/login', login);
api.use('/manage', manage);
api.use('/reset', reset);
api.use('/features', features);
api.use('/feature', features);

api.use((req, res) => res.status(404).end())
