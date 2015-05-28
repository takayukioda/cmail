#!/usr/bin/env node
'use strict';

console.log("Hello Cmail");

if (process.argv[2] === undefined) {
  console.log('argv:', process.argv);
}

if (process.argv[2] === 'home') {
  console.log('HOME:', process.env.HOME);
}

