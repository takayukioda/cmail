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

Cmail.prototype.save_token = function (token) {
  fs.writeFileSync(this.token_file, JSON.stringify(token));
}

Cmail.prototype.refresh_token = function (refresh) {
    this._token.access_token = refresh.access_token;
    this._token.expires_in   = refresh.expires_in;
    this._token.token_type   = refresh.token_type;
    this.save_token(this._token);
};

module.exports = function (env) {
  return new Cmail(env.config_file, env.token_file);
};
