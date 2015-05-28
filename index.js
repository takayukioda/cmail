#!/usr/bin/env node
'use strict';
var fs = require('fs');
var querystring = require('querystring');
var readline = require('readline-sync');
var request = require('request');

console.log("Hello Cmail");

if (process.argv[2] === undefined) {
  console.log('argv:', process.argv);
}

if (process.argv[2] === 'home') {
  console.log('HOME:', process.env.HOME);
}

if (process.argv[2] === 'auth') {
  var config = JSON.parse(fs.readFileSync(',/config.json')).installed;
  var params = {
    response_type: 'code',
    access_type: 'offline',
    approval_prompt: 'force',
    client_id: config.client_id,
    redirect_uri: config.redirect_uris[0],
    scope: 'https://www.googleapis.com/auth/gmail.labels',
    state: 'some random string haha'
  };
  var uri = config.auth_uri +'?'+ querystring.encode(params);
  console.log(uri);
}

if (process.argv[2] === 'token') {
  var config = JSON.parse(fs.readFileSync(',/config.json')).installed;
  var code = readline.question('Input returned code: ');
  var params = {
    grant_type: 'authorization_code',
    code: code,
    client_id: config.client_id,
    client_secret: config.client_secret,
    redirect_uri: config.redirect_uris[0]
  };
  var options = {
    uri: config.token_uri,
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
    fs.writeFileSync(',/token.json', JSON.stringify(body));
  });
}
