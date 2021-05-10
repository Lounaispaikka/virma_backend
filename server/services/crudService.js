const db = require('../../db');
const Model = require('../../db');

function createLog(operation, model, name = undefined, user = undefined, message = undefined) {

  const params = {
    operation: operation,
    target_name: name ? name : undefined,
    target_table: model.getTableName(),
    timestamp: new Date,
    msg: message+'',
    executor: user ? user : undefined
  }
  console.error("ERROR",operation,name,model.getTableName(),message);
  Model.logs.create(params);
}

exports.createFeature = function(res, model, params, user) {
  model.create(params).then(response => {
    createLog('CREATE', model, params.name_fi, user);
    res.json({ 'message': response });
  }).catch(error => {
    createLog('CREATE_ERROR', model, undefined, undefined, error);
    res.status(500).json({ 'message': error });
  });
}

exports.updateFeature = function(res, model, id, params, user) {
  model.update(params, { where: { gid: id } }).then(response => {
    createLog('UPDATE', model, params.name_fi, user);
    res.json({ 'message': response });
  }).catch(error => {
    createLog('UPDATE_ERROR', model, undefined, undefined, error);
    res.status(500).json({ 'message': error });
  });
}

exports.deleteFeature = function(res, model, id, name, user) {
  model.destroy({ where: { gid: id } }).then(response => {
    createLog('DELETE', model, name, user);
    res.json({ 'message': response });
  }).catch(error => {
    createLog('DELETE_ERROR', model, undefined, undefined, error);
    res.status(500).json({ 'message': error });
  });
}
