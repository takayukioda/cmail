#!/usr/bin/env node
'use strict';
var fs = require('fs');
var querystring = require('querystring');

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
