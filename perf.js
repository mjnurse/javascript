/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */

const md5 = require('md5');

const timeMS = (prevTime = 0) => {return Date.now() - prevTime;};
const rndInt = (max) => Math.floor(Math.random() * max) + 1;
const hash = (value) => {return md5(value+'');};
const clog = (...args) => {console.log(args);};

const h2 = (str, underLineChar = '-') => {
  console.log();
  console.log(str);
  console.log(underLineChar.padEnd(str.length, underLineChar));
};

const h1 = (str) => {
  h2(str.toUpperCase(), '=');
};

const p = (name, num, item, duration) => {
  console.log(name, num, item, '-', duration, 'ms total,',
      duration/num, 'ms per operation');
};

hashList = [];

// Base Tests
if (false) {
  h1('Base Tests');
  num=1000000;
  start=timeMS();
  for (let i=0; i<num; i++) {
    const dummy = timeMS(123);
  }
  p('timeMS', num, 'executions', timeMS(start));

  num = 1000000;
  start = timeMS();
  for (let i=0; i<num; i++) {
    const res = rndInt(1000000);
  }
  p('rndInt', num, 'executions', timeMS(start));

  num = 1000000;
  start = timeMS();
  for (let i=0; i<num; i++) {
    const res = hash(1000000);
  }
  p('MD5 hash', num, 'executions', timeMS(start));
}

// List Tests
if (false) {
  h1('List Tests');
  h2('Create 1000000 x 32 Char List');

  list = [];
  num = 1000000;
  start = timeMS();
  for (let i=0; i<num; i++) {
    str = i + ''.padStart(32, '0');
    list.push((str));
  }
  p('Push', num, 'items', timeMS(start));

  num = 1000;
  start = timeMS();
  for (let i=0; i<num; i++) {
    str = i + ''.padStart(32, '0');
    pos = list.indexOf(str);
  }
  p('Find (indexOF) first', num, 'items', timeMS(start));

  num = 1000;
  start = timeMS();
  for (let i=0; i<num; i++) {
    str = rndInt(1000000) + ''.padStart(32, '0');
    pos = list.indexOf(str);
  }
  p('Find (indexOf) random', num, 'items', timeMS(start));
}

if (true) {
  h2('Create List Hash Values (to use later on');
  num = 1000000;
  start = timeMS();
  for (let i=0; i<num; i++) {
    hashList.push(hash(i));
  }
  p('Push', num, 'hash values', timeMS(start));
}

// Array Tests
if (true) {
  h1('Array Tests');
  h2('Create 1000000 x 32 Char Array');
  list = [];
  num = 1000000;
  start = timeMS();
  for (let i=0; i<num; i++) {
    list[hashList[i]] = 1;
  }
  p('Add', num, 'items', timeMS(start));

  h2('Read 10,000 items');
  num = 10000;
  start = timeMS();
  hits = 0;
  for (let i=0; i<num; i++) {
    if (list[hashList[i*10]] == 1) {hits++;};
  }
  p('-', hits, 'hits', timeMS(start));
}
