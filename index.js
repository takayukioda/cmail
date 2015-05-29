#!/usr/bin/env node
'use strict';
var cmail = require('./cmail')({
  config_file: ',/config.json',
  token_file: ',/token.json',
});
var querystring = require('querystring');
var readline = require('readline-sync');
var request = require('request');

if (process.argv[2] === 'auth') {
  var params = {
    response_type: 'code',
    access_type: 'offline',
    approval_prompt: 'force',
    client_id: cmail.config('client_id'),
    redirect_uri: cmail.config('redirect_uris')[0],
    scope: 'https://www.googleapis.com/auth/gmail.labels',
    state: 'some random string haha'
  };
  var uri = cmail.config('auth_uri') +'?'+ querystring.encode(params);
  console.log(uri);
}

if (process.argv[2] === 'token') {
  var code = readline.question('Input returned code: ');
  var params = {
    grant_type: 'authorization_code',
    code: code,
    client_id: cmail.config('client_id'),
    client_secret: cmail.config('client_secret'),
    redirect_uri: cmail.config('redirect_uris')[0]
  };
  var options = {
    uri: cmail.config('token_uri'),
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
    cmail.save_token(body);
  });
}

if (process.argv[2] === 'refresh') {
  var endpoint = 'https://www.googleapis.com/oauth2/v3/token';
  var params = {
    grant_type: 'refresh_token',
    client_id: cmail.config('client_id'),
    client_secret: cmail.config('client_secret'),
    refresh_token: cmail.token('refresh_token')
  };
  var options = {
    uri: endpoint,
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
    cmail.refresh_token(body);
  });
}

if (process.argv[2] === 'labels') {
  var endpoint = 'https://www.googleapis.com/gmail/v1/users/me/labels';
  var params = {
    access_token: cmail.token('access_token'),
    prettyPrint: true
  };
  var options = {
    uri: endpoint,
    qs: params,
    json: true
  };
  request.get(options, function (error, response, body) {
    if (response.statusCode !== 200) {
      console.log("Error:", error);
      console.log("Status code:", response.statusCode);
      console.log("Body:", body);
      return false;
    }
    var sysLabels = body.labels.filter(function (item) {
      return item.type === 'system';
    });
    var usrLabels = body.labels.filter(function (item) {
      return item.type === 'user';
    });
    console.log("System Labels");
    sysLabels.forEach(function (item) {
      console.log(item.id, ':', item.name);
    });
    console.log("User Labels");
    usrLabels.forEach(function (item) {
      console.log(item.id, ':', item.name);
    });
  });

}
