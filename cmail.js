/**
  * @author da0shi
  */
'use strict';
var fs = require('fs');

function Cmail (config_file, token_file) {
  this.config_file = config_file;
  this.token_file = token_file;
  this._config = null;
  this._token = null;
}

Cmail.prototype.config = function (key) {
  if (this._config === null) {
    this._config = JSON.parse(fs.readFileSync(this.config_file)).installed;
  }
  if (key !== undefined) { return this._config[key]; }
  return this._config;
};

module.exports = function (env) {
  return new Cmail(env.config_file, env.token_file);
};
