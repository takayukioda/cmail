/**
  * @author da0shi
  */
'use strict';
var fs          = require('fs'),
    request     = require('request'),
    querystring = require('querystring');

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

Cmail.prototype.token = function (key) {
  if (this._token === null) {
    this._token = JSON.parse(fs.readFileSync(this.token_file));
  }
  if (key !== undefined) { return this._token[key]; }
  return this._token;
};

Cmail.prototype.save_token = function (token) {
  fs.writeFileSync(this.token_file, JSON.stringify(token));
};

Cmail.prototype.refresh_token = function (refresh) {
    this._token.access_token = refresh.access_token;
    this._token.expires_in   = refresh.expires_in;
    this._token.token_type   = refresh.token_type;
    this.save_token(this._token);
};

Cmail.prototype.authorize = function () {
  var params = {
    response_type: 'code',
    access_type: 'offline',
    approval_prompt: 'force',
    client_id: this.config('client_id'),
    redirect_uri: this.config('redirect_uris')[0],
    scope: 'https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.readonly',
    state: 'some random string haha'
  };
  var uri = this.config('auth_uri') +'?'+ querystring.encode(params);
  require('open')(uri);
};

Cmail.prototype.getToken = function (code) {
  var self = this;
  var params = {
    grant_type: 'authorization_code',
    code: code,
    client_id: this.config('client_id'),
    client_secret: this.config('client_secret'),
    redirect_uri: this.config('redirect_uris')[0]
  };
  var options = {
    uri: this.config('token_uri'),
    form: params,
    json: true
  };
  request.post(options, function (error, response, body) {
    if (response.statusCode !== 200) {
      console.log("Error:", error);
      console.log("Status code:", response.statusCode);
      console.log("Body:", body);
      return false;
    }
    self.save_token(body);
  });
};

module.exports = function (env) {
  return new Cmail(env.config_file, env.token_file);
};
