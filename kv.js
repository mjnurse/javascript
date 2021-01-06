/* eslint-disable brace-style */
/* eslint valid-jsdoc: "error" */
/* eslint-env es6 */

const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');

const SQLMAXVALUES = 990;
// const KEYLENGTH = 32;
const KEYLENGTH = 4;
const DEFAULTNUMTYPES = 2;
const DEFAULTMAXLINKS = 20;
const DEFAULTMAXVALUE = 50000000;

const DBCONN = [];
const BUFFER = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
const DEBUG = false;

const p = console.log;
const debug = (...args) => {if (DEBUG) {console.log('DEBUG:', args);}};
const timeMS = (prevTime = 0) => {return Date.now() - prevTime;};
const rndInt = (max) => {return Math.floor(Math.random() * max) + 1;};
// const hash = (value) => {return md5(value+'').substr(0, KEYLENGTH);};
const hash = (value) => {return (value+'').padStart(KEYLENGTH, '0');};
const getPtn = (key) => {return key.substr(0, 1);};

// =============================================================================
// Key-Value Database Management Functions.
// =============================================================================

/**
 * Opens a connection to a SQLITE3 database the name of which is dbName +
 * ptnName.  If the connection is already open, return the connection.
 * @param {text} dbName SQLITE3 database name.
 * @param {text} ptnName A SQLITE3 database name partition name (0-f).
 * @returns {SQLITE3DbConnection} Connection to a SQLITE3 database.
 */
function dbOpen(dbName, ptnName) {
  ptnNum=parseInt(ptnName, 16);
  if (DBCONN[ptnNum]) {
    debug('func', 'open', dbName, ptnName, 'already open');
  } else {
    debug('func', 'open', dbName, ptnName);
    DBCONN[ptnNum] =
        new sqlite3.Database(dbName+ptnName+'.db');
  }
  return DBCONN[ptnNum];
}

/**
 * Runs a non producing SQL statement against a SQLITE3 database.
 * @param {text} dbName A SQLITE3 database name.
 * @param {text} ptnName A SQLITE3 database name partition name (0-f).
 * @param {text} query SQL query.
 * @param {array} valueArr Values for use in the SQL statement.
 * @returns {promise} A promise referencing the statement execution.
 */
async function dbRunStmt(dbName, ptnName, query, valueArr = []) {
  debug('dbRunStmt', dbName, ptnName, query);
  await dbOpen(dbName, ptnName);
  ptnNum=parseInt(ptnName, 16);
  return new Promise(function(resolve, reject) {
    DBCONN[ptnNum].run(query, valueArr, function(err) {
      if (err) {
        reject(err.message);
      } else {
        resolve('Success');
      }
    });
  });
}

/**
 * Runs a producing SQL statement (SELECT) against a SQLITE3 database.
 * @param {text} dbName A SQLITE3 database name.
 * @param {text} ptnName A SQLITE3 database name partition name (0-f).
 * @param {text} query SQL query.
 * @returns {promise} A promise referencing the statement execution.
 */
async function dbQueryAll(dbName, ptnName, query) {
  debug('dbQueryAll', dbName, ptnName, query);
  await dbOpen(dbName, ptnName);
  ptnNum=parseInt(ptnName, 16);
  return new Promise(function(resolve, reject) {
    DBCONN[ptnNum].all(query, function(err, data) {
      if (err) {
        reject(err.message);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Writes the contents of a key-value buffer to a SQLITE3 database.
 * @param {text} dbName A SQLITE3 database name.
 * @param {text} ptnName A SQLITE3 database name partition name (0-f or all).
 * @returns {boolean} Success or not of the flush.
 */
async function kvFlush(dbName, ptnName) {
  debug('func', 'kvFlush', dbName, ptnName);
  let minPtn = 0; let maxPtn = 15;
  if (ptnName != 'all') {
    minPtn = parseInt(ptnName, 16);
    maxPtn = minPtn;
  }
  for (let ptnNum=minPtn; ptnNum<=maxPtn; ptnNum++) {
    const ptnName = ptnNum.toString(16);
    await dbOpen(dbName, ptnName);
    let sql = 'INSERT INTO kv (key, value) VALUES ';
    if (BUFFER[ptnNum].length > 0) {
      for (let i = 0; i<BUFFER[ptnNum].length/2; i++) {
        sql += '(?,?),';
      }
      const buffLen = BUFFER[ptnNum].length / 2;
      await dbRunStmt(dbName, ptnName, sql.slice(0, -1), BUFFER[ptnNum]);
      BUFFER[ptnNum] = [];
      debug('Buffer Flushed. Partition', ptnName, 'Length: ', buffLen);
    }
  }
  return true;
}

/**
 * ???.
 * @param {text} dbName A SQLITE3 database name.
 * @param {text} ptnName A SQLITE3 database name partition name (0-f).
 * @param {text} key The key.
 * @param {text} value The value.
 * @returns {int} The sum of the two numbers.
 */
async function kvAdd(dbName, ptnName, key, value) {
  debug('kvAdd', dbName, ptnName, key, value);
  ptnNum = parseInt(ptnName, 16);
  await dbOpen(dbName, ptnName);
  BUFFER[ptnNum].push(key);
  BUFFER[ptnNum].push(value);
  if (BUFFER[ptnNum].length > SQLMAXVALUES) {
    await kvFlush(dbName, ptnName);
  }
}

/**
 * ???.
 * @param {int} ???.
 * @returns {int} The sum of the two numbers.
 */
// async function kvRead(key, ptnName) {
//   if (typeof(key) == 'string') {
//     await dbQueryAll('select * from kv');
//   } else {
//     await dbQueryAll('select * from kv');
//   }
// }

/**
 * Print to the console key-value Database statistics.
 * @param {text} dbName A SQLITE3 database name.
 * @returns {nothing} Nothing.
 */
async function kvStats(dbName) {
  let recs;
  let totalRecs = 0;
  for (let ptnNum=0; ptnNum<16; ptnNum++) {
    const ptnName = ptnNum.toString(16);
    await dbOpen(dbName, ptnName);
    p('stats - db: ' + dbName + ', partition: ' + ptnName,
        recs = await dbQueryAll(dbName, ptnName,
            'SELECT COUNT(*) AS total_records FROM kv'),
        await dbQueryAll(dbName, ptnName,
            'SELECT fragments, COUNT(*) AS num ' +
            'FROM (SELECT key, COUNT(*) AS fragments FROM kv GROUP BY key) ' +
            'GROUP BY fragments'));
    totalRecs += recs[0].total_records;
  }
  p('TOTAL RECORDS', totalRecs);
}

/**
 * Retrieves a list of key-values specified in a list of keys.
 * @param {text} dbName A SQLITE3 database name.
 * @param {list} keyList A list of text key-values.
 * @returns {int} The sum of the two numbers.
 */
async function kvFind(dbName, keyList) {
  const idListStrs =
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  for (let i=0; i<keyList.length; i++) {
    ptn = parseInt(keyList[i].substr(0, 1), 16);
    idListStrs[ptn] += '"' + keyList[i] + '",';
  }
  const qryList=[];
  for (let i=0; i<16; i++) {
    const qry = 'SELECT value AS r FROM kv WHERE key IN (' +
        idListStrs[i].substr(0, idListStrs[i].length - 1 ) + ')';
    qryList[i] = dbQueryAll(dbName, i.toString(16), qry);
  }
  // clog('Queries Submitted', 'ms', timeMS(startTime));
  // startTime = timeMS();
  let allRes = [];
  for (let i=0; i<16; i++) {
    const res = await qryList[i];
    allRes = allRes.concat(res);
    // clog('ptn', i, 'hits', res.length, 'ms', timeMS(startTime));
  }
  // clog('total hits', allRes.length, 'ms', timeMS(startTime));
  return allRes;
}

// =============================================================================
// Network Build Functions.
// =============================================================================

/**
 * Adds Network Edges.
 * @param {text} dbName A SQLITE3 database name.
 * @param {text} edgeType The edge type.
 * @param {text} startNode The edge start node.
 * @param {text} endNodeList A list of edge end nodes.
 * @returns {nothing} Nothing.
 */
async function nwAddEdge(dbName, edgeType, startNode, endNodeList) {
  debug('func', 'add', edgeType, startNode, endNodeList);
  let endNodeHashList = '';
  for (let i = 0; i<endNodeList.length; i++) {
    endNodeHashList += hash(endNodeList[i]);
  }
  const key = hash(startNode);
  const ptnName = getPtn(key);
  await kvAdd(dbName, ptnName, key, edgeType+'|'+startNode+'|'+endNodeHashList);
}

// =============================================================================
// Test Functions.
// =============================================================================

/**
 * A function to generate and load random test edges.
 * @param {text} dbName A SQLITE3 database name.
 * @param {int} numRecords The number of edge records to add.
 * @param {int} numEdgeTypes Number of different edge types.
 * @param {int} maxNodeValue Max node value.
 * @param {int} maxNumEdges Max number of edges from start node.
 * @returns {int} The sum of the two numbers.
 */
async function loadRandomEdges(
    dbName, numRecords, numEdgeTypes, maxNodeValue, maxNumEdges) {
  (async () => {
    const start = timeMS();
    let prevTime = start;
    for (let n = 0; n<numRecords; n++) {
      const valList = [];
      for (let i = 0; i<rndInt(maxNumEdges); i++) {
        valList.push(rndInt(maxNodeValue).toString());
      }
      await nwAddEdge(
          dbName,
          rndInt(numEdgeTypes).toString(),
          n.toString(),
          valList);
      if (n%100000 == 0) {
        console.log(n, 'of', numRecords, 'loaded -',
            timeMS(start), timeMS() - prevTime);
        prevTime = timeMS();
      }
    }
    await kvFlush(dbName, 'all');
    console.log('Runtime:', timeMS(start));
  })();
}

/**
 * A function to generate and load random test edges.
 * @param {text} dbName A SQLITE3 database name.
 * @param {int} numRecords The number of edge records to add.
 * @param {int} numEdgeTypes Number of different edge types.
 * @param {int} maxNodeValue Max node value.
 * @param {int} maxNumEdges Max number of edges from start node.
 * @returns {int} The sum of the two numbers.
 */
async function loadTestNetworks(
    dbName, numRecords, numEdgeTypes, maxNodeValue, maxNumEdges) {
  (async () => {
    const start = timeMS();
    let prevTime = start;
    for (let n = 0; n<numRecords; n++) {
      const valList = [];
      for (let i = 0; i<rndInt(maxNumEdges); i++) {
        valList.push(rndInt(maxNodeValue).toString());
      }
      await nwAddEdge(
          dbName,
          rndInt(numEdgeTypes).toString(),
          n.toString(),
          valList);
      if (n%100000 == 0) {
        console.log(n, 'of', numRecords, 'loaded -',
            timeMS(start), timeMS() - prevTime);
        prevTime = timeMS();
      }
    }
    await kvFlush(dbName, 'all');
    console.log('Runtime:', timeMS(start));
  })();
}

/**
 * ???.
 * @param {text} dbName A SQLITE3 database name.
 * @param {int} numSearches The number of key-values to find.
 * @returns {int} The sum of the two numbers.
 */
async function find(dbName, numSearches) {
  const startTime = timeMS();
  const keyList = [];
  for (let i=0; i<numSearches; i++) {
    keyList[i] = hash(rndInt(maxValue));
  }
  p('Key list build', 'ms', timeMS(startTime));
  await kvFind(dbName, keyList);
}

/**
 * ???.
 * @param {text} dbName A SQLITE3 database name.
 * @param {text} seed A start node in the network.
 * @param {int} maxIterations The max number of search / expand iterations.
 * @returns {int} .
 */
async function resolve(dbName, seed, maxIterations) {
  const resultsList = [];
  const resultsArr = [];
  const hashKeysSearchedArr = [];
  let searchHashKeyList = [];
  let valuesList = [];

  searchHashKeyList[0] = hash(seed);
  hashKeysSearchedArr[hash(seed)] = 1;

  p('Seed Value:', seed);

  for (let iteration=0; iteration<maxIterations; iteration++) {
    p('--------------------------------------------------');
    valuesList = await kvFind(dbName, searchHashKeyList);
    p('Itr:', iteration, 'Results:', valuesList.length);
    p(valuesList);
    searchHashKeyList = [];
    newVals = 0;
    repeatVals = 0;
    for (let i=0; i<valuesList.length; i++) {
      values = valuesList[i].r.split('|');
      p('process:', values);
      const value = values[1];
      const keyStr = values[2];
      if (!resultsArr[value]) {
        for (let j=0; j<keyStr.length/KEYLENGTH; j++) {
          hashKey = keyStr.substr(j*KEYLENGTH, KEYLENGTH);
          if (!hashKeysSearchedArr[hashKey]) {
            p('new key:', hashKey);
            hashKeysSearchedArr[hashKey] = 1;
            searchHashKeyList.push(hashKey);
          } else {
            p('repeat key:', hashKey);
          }
        }
      }
    }
    for (let i=0; i<valuesList.length; i++) {
      values = valuesList[i].r.split('|');
      const value = values[1];
      const keyStr = values[2];
      if (!resultsArr[value]) {
        resultsArr[value] = 1;
        resultsList.push(value);
        newVals++;
      } else {
        repeatVals++;
      }
    }
    p('New Vals:', newVals, 'Rpt Vals:', repeatVals,
        'Tot Results:', resultsList.length);
    p('resultsArr:', resultsArr);
    p('resultsList:', resultsList);
    p('hashKeysSearchedArr:', hashKeysSearchedArr);
    p('Next Srch for', searchHashKeyList.length, 'keys');
    p('searchHashKeyList', searchHashKeyList);
  }
}

// =============================================================================
// Command Line Invocation.
// =============================================================================

const numTypes = DEFAULTNUMTYPES;
const maxNumLinks = DEFAULTMAXLINKS;
const maxValue = DEFAULTMAXVALUE;
const args = process.argv;

if (args.length < 3 ) {
  console.log('usage: node kv.js <operation> <...>');
  process.exit(1);
}
const operation = args[2];

// Load
if (operation == 'load') {
  if (args.length < 7) {
    console.log('usage: node kv.js load ' +
    '<db_name> <num_records> <value_range> [<num_types> [<max_edges>]]');
    process.exit(1);
  }
  const dbName = args[3];
  const numRecords = args[4];
  const valueRange = args[5];
  let numTypes = DEFAULTNUMTYPES;
  (args.length > 6) && (numTypes = args[6]);
  let maxLinks = DEFAULTMAXLINKS;
  (args.length > 7) && (maxLinks = args[7]);

  loadRandomEdges(dbName, numRecords, numTypes, valueRange, maxLinks);

// Stats
} else if (operation == 'stats') {
  const dbName = args[3];
  kvStats(dbName);

// Find
} else if (operation == 'find') {
  const dbName = args[3];
  const numSearches = args[4];
  let iterations = 1;
  (args.length == 6) && (iterations = args[5]);

  (async () => {
    for (let i = 0; i< iterations; i++) {
      await find(dbName, numSearches);
    }
  })();

// Resolve
} else if (operation == 'resolve') {
  const dbName = args[3];
  const seed = args[4];
  resolve(dbName, seed, 3);

// Resolve Performance
} else if (operation == 'resolve-perf') {
  const dbName = args[3];
  const iterations = args[4];
  // const maxValue = MAXVALUE; // args[5];
  const maxValue = 10; // MAXVALUE; // args[5];

  (async () => {
    const st = timeMS();
    for (let i = 0; i < iterations; i++) {
      const itSt = timeMS();
      p('==================================================');
      await resolve(dbName, rndInt(maxValue), 5);
      p('==================================================');
      p('Iteration Runtime', timeMS(itSt));
    }
    p('==================================================');
    p('Average Runtime', timeMS(st)/iterations);
    p('Total Runtime', timeMS(st));
    p('==================================================');
  })();
}
