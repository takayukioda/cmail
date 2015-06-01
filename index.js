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
  var uri = cmail.get_auth_url();
  require('open')(uri);
  var code = readline.question('Input returned code: ');
  cmail.request_token(code);
}

if (process.argv[2] === 'refresh') {
  cmail.request_refresh();
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

if (process.argv[2] === 'unread') {
  var endpoint = 'https://www.googleapis.com/gmail/v1/users/me/messages';
  var params = {
    maxResults: 5,
    labelIds: 'UNREAD',
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

    if (body.messages === undefined) {
      console.log("No unread messages");
      return true;
    }
    body.messages.forEach(function (item) {
      var endpoint = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + item.id;
      var params = {
        format: 'minimal',
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
        console.log('Snippet:', body.snippet);
        console.log('url: ', 'https://mail.google.com/mail/u/0/#all/'+ body.id);
        console.log('');
      });
    });
  });
}

