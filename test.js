const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');

const clog = (...args) => {console.log(args)}

const KEYLENGTH=8;
const DEBUG=false;

let DBCONN=[];

function open(path, partition=0) {
  DBCONN[partition] = new sqlite3.Database(path+partition+'.db');
  return DBCONN[partition];
}


async function select(query, partition=0) {
  return new Promise(function(resolve, reject) {
    DBCONN[partition].all(query, function(err, data) {
      if (err) {
        clog(err);
      } else {
        resolve(data);
      }
    });
  });
}

(async () => {
  clog(1);
  clog(open('test'));
  clog(await select('SELECT * FROM kv'));
  clog(1);
})();