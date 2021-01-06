const elasticsearch = require('elasticsearch');

const startTime = Date.now();
let iteration = 0;

const clientArr = [];
clientArr[0] = new elasticsearch.Client({hosts: ['localhost:9200/']});
clientArr[1] = new elasticsearch.Client({hosts: ['localhost:9201/']});
clientArr[2] = new elasticsearch.Client({hosts: ['localhost:9202/']});

/**
 * Create a random string of the specified length.
 * @param {int} length The length of the string to create.
 * @return {text} A random string of the specified length.
 */
function randStr(length) {
  let str = '';
  for (let i=0; i<length; i++) {
    str += String.fromCharCode(96 + Math.floor(Math.random()*26)+1);
  }
  return str;
}

/**
 * Queries the metadata of an index or all indexes if no index name passed in.
 * The details are written to the console.
 * @param {text} indexName The name of an index to query metadata for.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function getIndices(indexName = '', client = 0) {
  clientArr[client].cat.indices({
    index: indexName,
    bytes: 'm',
  }, function(err, resp, status) {
    if (err) {
      console.log(Date.now() - startTime, ',', iteration,
          ', size ,', 'error');
      console.log(Date.now() - startTime, ',', iteration,
          ', recs ,', 'error');
    } else {
      console.log(Date.now() - startTime,
          ',', iteration, ', size ,', resp.split(/ /)[8]);
      console.log(Date.now() - startTime,
          ',', iteration, ', recs ,', resp.split(/ /)[6]);
    }
  });
}

/**
 * Queries the metadata of an index segments or all index segments if no index
 * name passed in.  The details are written to the console.
 * @param {text} indexName The name of an index to query metadata for.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function getSegments(indexName = '', client = 0) {
  clientArr[client].cat.segments({
    index: indexName,
    bytes: 'm',
  }, function(err, resp, status) {
    if (err) {
      console.log(Date.now() - startTime, ',', iteration,
          ', segs ,', 'error');
    } else {
      try {
        console.log(Date.now() - startTime, ',', iteration,
            ', segs ,', resp.split(/\r\n|\r|\n/).length);
      } catch {
        // nowt
      }
    }
  });
}

/**
 * Creates an index.
 * @param {text} indexName The name of the index to create.
 * @param {int} numShards The number of index shards to create.  Default 5.
 * @param {int} numReplicas The number of index replicas to create.  Default 0.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function createIndex(indexName, numShards = 5, numReplicas = 0, client = 0) {
  clientArr[client].indices.create({
    index: indexName,
    body: {settings: {index: {
      number_of_shards: numShards,
      number_of_replicas: numReplicas,
    }}},
  }, function(err, resp, status) {
    if (err) {
      console.log(err);
    } else {
      console.log('create', resp);
    }
  });
}

/**
 * Deletes an index.
 * @param {text} indexName The name of the index to delete.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function deleteIndex(indexName, client = 0) {
  clientArr[client].indices.delete({index: indexName},
      function(err, resp, status) {
        if (err) {
          console.log(err);
        } else {
          console.log('delete', resp);
        }
      });
}

/**
 * Adds a document to an index.
 * @param {text} indexName The name of the index to add the document to.
 * @param {text} docJson The document content JSON.
 * @param {int} refreshMode The document will not be visible to a search until
 *     the index is refreshed. The index refresh mode: 'false': don't wait for
 *     a refresh. 'true': force an index refresh. 'wait_for': wait for an
 *     automatic index refresh before returning.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function addDocument(indexName, docJson, refreshMode = 'false', client = 0) {
  clientArr[client].index({
    index: indexName,
    refresh: refreshMode,
    body: docJson,
  }, function(err, resp, status) {
    if (err) {
      console.log(err);
    } else {
      console.log(resp);
    }
  });
}

/**
 * Deletes a document from an index.
 * @param {text} indexName The name of the index to add the document to.
 * @param {text} docId The Id of the document to delete.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function deleteDocument(indexName, docId, client = 0) {
  clientArr[client].delete({
    index: indexName,
    id: docId,
    type: 'constituencies',
  }, function(err, resp, status) {
    console.log(resp);
  });
}

/**
 * Adds a list of documents to an index.
 * @param {text} indexName The name of the index to add the documents to.
 * @param {text} docListJson The document list content JSON.
 * @param {int} refreshMode The document will not be visible to a search until
 *     the index is refreshed. The index refresh mode: 'false': don't wait for
 *     a refresh. 'true': force an index refresh. 'wait_for': wait for an
 *     automatic index refresh before returning.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function bulkAddDocument(
    indexName, docListJson, refreshMode = 'false', client = 0) {
  jArr = [];
  for (let i=0; i<docListJson.length; i++) {
    jArr.push({index: {_index: indexName}});
    jArr.push(docListJson[i]);
  }
  clientArr[client].bulk({
    refresh: refreshMode,
    body: jArr,
  }, function(err, resp, status) {
    if (err) {
      console.log(Date.now() - startTime, ',', iteration,
          ', added ,', 'error');
    } else {
      console.log(Date.now() - startTime, ',', iteration,
          ', added , ', resp.items.length);
    }
  });
}

/**
 * Search an index using query JSON.
 * @param {text} indexName The name of the index to search.
 * @param {text} queryJson The query JSON.
 * @param {int} client The id for the Elasticsearch client to use.
 */
function search(indexName, queryJson, client = 0) {
  clientArr[client].search({
    index: indexName,
    body: {
      query: queryJson,
    },
  }, function(err, resp, status) {
    if (err) {
      console.log(Date.now() - startTime, ',', iteration,
          ', hits ,', 'error');
    } else {
      console.log(Date.now() - startTime, ',', iteration,
          ', hits ,', resp.hits.total.value);
    }
  });
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const args = process.argv;
const mode = args[2];

if (mode != 'reset' && mode != 'create' &&
    mode != 'read' && mode != 'create_read') {
  console.log('usage: es <mode: reset/create/read/create_read>');
  console.log('> es reset <index name> <num shards> <num replicas>');
  console.log('> es create/create_read <index name> <refresh mode> ' +
      '<num iterations> <set size> <sleep ms>');
  console.log('> es read <index name> <num iterations> <set size> ' +
      '<sleep ms>');
  process.exit(1);
}

if (mode == 'reset') {
  (async () => {
    if (args.length != 4 + 2) {
      console.log('> es reset <index name> <num shards> <num replicas>');
      process.exit(1);
    }
    const indexName = args[3];
    const numShards = args[4];
    const numReplicas = args[5];
    console.log('Dropping and recreating index');
    res = await deleteIndex(indexName);
    res = await delay(1000);
    res = await createIndex(indexName, numShards, numReplicas);
  })();
}

if (mode == 'create') {
  if (args.length != 6 + 2) {
    console.log('> es create/create_read <index name> <refresh mode> ' +
        '<num iterations> <set size> <sleep ms>');
    process.exit(1);
  }
  const indexName = args[3];
  const refreshMode = args[4];
  const iterations = args[5];
  const setSize = args[6];
  const sleepMs = args[7];

  console.log('iterations:', iterations, 'set size:', setSize);

  (async () => {
    for (let i=0; i<iterations; i++) {
      const bulkDocs = [];
      for (let set=0; set<setSize; set++) {
        const num = 1000000000 + 1000 * i + set;
        bulkDocs.push({'name': 'martin'+num, 'age': num});
      }
      res = await bulkAddDocument(indexName, bulkDocs, refreshMode, 0);
      res = await delay(sleepMs);
    }
  })();
}

if (mode == 'read') {
  if (args.length != 4 + 2) {
    console.log('> es read <index name> <num iterations> <set size> ' +
        '<sleep ms>');
    process.exit(1);
  }
  const indexName = args[3];
  const iterations = args[4];
  const setSize = args[5];
  const sleepMs = args[6];

  (async () => {
    for (let i=0; i<iterations; i++) {
      const termList = [];
      for (let d=0; d<setSize; d++) {
        const num = 1000000000 + 1000 * i + d;
        termList.push('martin'+num);
      }
      const query = {
        'terms': {
          'name': termList,
        },
      };
      res = await search(indexName, query, 2);
      res = await delay(sleepMs);
    }
  })();
}

if (mode == 'create_read') {
  if (args.length != 6 + 2) {
    console.log('> es create/create_read <index name> <refresh mode> ' +
        '<num iterations> <set size> <sleep ms>');
    process.exit(1);
  }
  const indexName = args[3];
  const refreshMode = args[4];
  const iterations = args[5];
  const setSize = args[6];
  const sleepMs = args[7];

  let lastTime = startTime;

  (async () => {
    console.log('ms,i,n,v');
    for (let i=0; i<iterations; i++) {
      const bulkDocs = [];
      const termList = [];

      for (let set=0; set<setSize; set++) {
        const str = randStr(40);
        bulkDocs.push({'name': str});
        termList.push(str);
      }
      res = await bulkAddDocument(indexName, bulkDocs, refreshMode, 0);
      res = await delay(sleepMs);

      const query = {
        'terms': {
          'name': termList,
        },
      };
      res = await search(indexName, query, 2);
      getSegments(indexName);
      getIndices(indexName);
      const timeNow = Date.now();
      console.log(timeNow - startTime, ',', iteration,
          ', duration ,', timeNow - lastTime);
      lastTime = timeNow;
      iteration += 1;
    }
  })();
}
