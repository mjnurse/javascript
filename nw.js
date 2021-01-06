/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

p = console.log;
const rndInt = (max) => Math.floor(Math.random() * max) + 1;


const DEFAULTNODESIZE = 10;
const DEFAULTEDGEWIDTH = 2;
const DEFAULTCOLOR = '#155799';

const nodes = [];
const edges = [];

let nodeId = 0;
let edgeId = 0;

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {string} label DESC (default: '').
 *   - @param {int} size DESC (default: DEFAULTNODESIZE).
 *   - @param {string} color DESC (default: DEFAULTCOLOR).
 * @return {DATATYPE} DESC.
 */
function addNode(pObj={}) {
  const label = pObj.label?pObj.label:'';
  const size = pObj.size?pObj.size:DEFAULTNODESIZE;
  let color = pObj.color?pObj.color:DEFAULTCOLOR;
  const id = 'n'+nodeId;

  if (color == 'random' || color == 'rand') {
    color = 'rgb('+rndInt(200)+', '+rndInt(200)+', '+rndInt(200)+')';
  }

  nodes[nodeId++] = {
    id: id,
    label: (label == 'id'?id:label),
    size: size,
    color: color};

  return id;
}

/**
 * Adds an edge to the network.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {string} from Start node for the edge (mandatory parameter).
 *   - @param {string} to End node for the edge (mandatory parameter).
 *   - @param {int} width of the edge when drawn (default: DEFAULTEDGEWIDTH).
 *   - @param {string} color of the edge when drawn (default: DEFAULTCOLOR).
 * @return {string} The id of the new edge.
 */
function addEdge(pObj={}) {
  const from = pObj.from;
  if (!from) throw Error('Mandatory parameter "from" missing');
  const to = pObj.to;
  if (!to) throw Error('Mandatory parameter "to" missing');
  const width = pObj.width?pObj.width:DEFAULTEDGEWIDTH;
  const color = pObj.color?pObj.color:DEFAULTCOLOR;
  const id = edgeId;
  edges[edgeId++] = {
    id: id,
    from: from,
    to: to,
    width: width,
    color: color};

  return id;
}

function logNodes(mode='json') {
  if (mode == 'csv') {
    p('"id","label","x","y","size","color"');
  }
  for (n in nodes) {
    if (mode == 'csv') {
      p('"'+nodes[n].id+'","'+nodes[n].label+'",'+nodes[n].x+','+nodes[n].y+
        ','+nodes[n].size+',"'+nodes[n].color+'"');
    } else {
      p(nodes[n], ',');
    }
  }
}

function logEdges(mode='json') {
  if (mode == 'csv') {
    p('"id","from","to","width","color"');
  }
  for (e in edges) {
    if (mode == 'csv') {
      p('"'+edges[e].id+'","'+edges[e].from+'","'+edges[e].to+
        '",'+edges[e].width+',"'+edges[e].color+'"');
    } else {
      p('{from: "'+edges[e].from+
      '", to: "'+edges[e].to+
      '", width: '+edges[e].width+
      ', color: "'+edges[e].color+'"},');
    }
  }
}

// function logSigma() {
//   p('json = {');
//   p('  "nodes": [');
//   logNodes('json');
//   p('],');
//   p('  "edges": [');
//   logEdges('json');
//   p(']}');
// }

function logVis() {
  p('let nodes = [');
  logNodes('json');
  p('];');
  p('let edges = [');
  logEdges('json');
  p('];');
}

function snowflake(pObj={}) {
  const tier1 = pObj.tier1?pObj.tier1:3;
  const tier2 = pObj.tier2?pObj.tier2:0;
  const tier3 = pObj.tier3?pObj.tier3:0;

  const n0 = addNode({color: 'red'});
  for (let t1=0; t1 < tier1; t1++) {
    const n1 = addNode();
    addEdge(n0, n1);
    for (let t2=0; t2 < tier2; t2++) {
      const n2 = addNode();
      addEdge(n1, n2);
      for (let t3=0; t3 < tier3; t3++) {
        const n3 = addNode();
        addEdge(n2, n3);
      }
    }
  }
  return n0;
}

// snowflake({tier1: 9, tier2: 3});

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} numNodes DESC (default: 20).
 *   - @param {int} connectionPercent DESC (default: 50).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {string} color DESC (default: DEFAULTCOLOR).
 * @return {DATATYPE} DESC.
 */
function mesh(pObj={}) {
  const numNodes = pObj.numNodes?pObj.numNodes:20;
  const connectionPercent = pObj.connectionPercent?pObj.connectionPercent:50;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const color = pObj.color?pObj.color:DEFAULTCOLOR;
  const nodes = [];
  for (let i=0; i < numNodes; i++) {
    nodes[i] = addNode({size: nodeSize, color: color});
  }
  for (let i=1; i < numNodes; i++) {
    addEdge({from: nodes[0], to: nodes[i], width: edgeWidth, color: color});
  }
  for (let i=1; i < numNodes; i++) {
    for (let j=1; j < numNodes; j++) {
      if (i > j) {
        if (rndInt(100) <= connectionPercent) {
          addEdge({from: nodes[i], to: nodes[j],
            width: edgeWidth, color: color});
        }
      }
    }
  }
  return nodes[0];
}

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} numNodes DESC (default: 11).
 *   - @param {string} startNode DESC (default: '').
 *   - @param {string} color DESC (default: DEFAULTCOLOR).
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 * @return {DATATYPE} DESC.
 */
function line(pObj={}) {
  const numNodes = pObj.numNodes?pObj.numNodes:11;
  const startNode = pObj.startNode?pObj.startNode:'';
  const color = pObj.color?pObj.color:DEFAULTCOLOR;
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;
  const nodes = [];

  nodes[0]=(startNode == ''?addNode({size: nodeSize, color: color}):startNode);

  for (let i=1; i < numNodes; i++) {
    nodes[i] = addNode({size: nodeSize, color: color});
  }
  for (let i=1; i < numNodes; i++) {
    addEdge({from: nodes[i-1], to: nodes[i],
      color: color, edgeWidth: edgeWidth, nodeSize: nodeSize});
  }
  return nodes[numNodes-1];
}

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} numNodes DESC (default: 9).
 *   - @param {string} startNode DESC (default: 'null').
 *   - @param {string} color DESC (default: '').
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 * @return {DATATYPE} DESC.
 */
function circle(pObj={}) {
  const numNodes = pObj.numNodes?pObj.numNodes:9;
  const startNode = pObj.startNode?pObj.startNode:'null';
  const color = pObj.color?pObj.color:'';
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;
  const nodes = [];

  nodes[0]=(startNode == 'null'?addNode(
      {size: nodeSize, color: color}):startNode);
  for (let i=1; i < numNodes; i++) {
    nodes[i] = addNode({size: nodeSize, color: color});
  }
  for (let i=1; i < numNodes; i++) {
    addEdge({from: nodes[i-1], to: nodes[i], width: edgeWidth, color: color});
  }
  addEdge({from: nodes[numNodes-1], to: nodes[0],
    width: edgeWidth, color: color});
  return nodes[numNodes-1];
}

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} numNodes DESC (default: 11).
 *   - @param {string} startNode DESC (default: '').
 *   - @param {string} color DESC (default: DEFAULTCOLOR).
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 * @return {DATATYPE} DESC.
 */
function wheel(pObj={}) {
  const numNodes = pObj.numNodes?pObj.numNodes:11;
  const startNode = pObj.startNode?pObj.startNode:'';
  const color = pObj.color?pObj.color:DEFAULTCOLOR;
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;

  const nodes = [];
  const hub = addNode({size: nodeSize, color: color});

  nodes[0]=(startNode == ''?addNode({size: nodeSize, color: color}):startNode);
  addEdge({from: hub, to: nodes[0], width: edgeWidth, color: color});
  for (let i=1; i <= numNodes; i++) {
    nodes[i] = addNode({size: nodeSize, color: color});
    addEdge({from: hub, to: nodes[i], width: edgeWidth, color: color});
  }
  for (let i=1; i <= numNodes; i++) {
    addEdge({from: nodes[i-1], to: nodes[i],
      width: edgeWidth, color: color});
  }
  addEdge({from: nodes[numNodes], to: nodes[0],
    width: edgeWidth, color: color});
  return nodes[numNodes];
}

function flower(bodySize, petalSize = bodySize) {
  const nodes = [];
  for (let i=0; i < bodySize; i++) {
    nodes[i] = circle(petalSize);
  }
  for (let i=1; i < bodySize; i++) {
    addEdge(nodes[i-1], nodes[i]);
  }
  addEdge(nodes[bodySize-1], nodes[0]);
  return nodes[0];
}

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} bodyNodes DESC (default: 11).
 *   - @param {int} rayNodes DESC (default: 3).
 *   - @param {string} startNode DESC (default: '').
 *   - @param {string} color DESC (default: DEFAULTCOLOR).
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 * @return {DATATYPE} DESC.
 */
function sun(pObj={}) {
  const bodyNodes = pObj.bodyNodes?pObj.bodyNodes:7;
  const rayNodes = pObj.rayNodes?pObj.rayNodes:3;
  const startNode = pObj.startNode?pObj.startNode:'';
  const color = pObj.color?pObj.color:DEFAULTCOLOR;
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;
  const nodes = [];

  for (let i=0; i < bodyNodes; i++) {
    nodes[i] = line({numNodes: rayNodes, color: color,
      edgeWidth: edgeWidth, nodeSize: nodeSize});
  }
  for (let i=1; i < bodyNodes; i++) {
    addEdge({from: nodes[i-1], to: nodes[i],
      color: color, edgeWidth: edgeWidth});
  }
  addEdge({from: nodes[bodyNodes-1], to: nodes[0],
    color: color, edgeWidth: edgeWidth});

  return nodes[0];
}

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} numPetals DESC (default: 9).
 *   - @param {int} petalSize DESC (default: 9).
 *   - @param {string} color DESC (default: '').
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 * @return {DATATYPE} DESC.
 */
function daisy(pObj={}) {
  const numPetals = pObj.numPetals?pObj.numPetals:9;
  const petalSize = pObj.petalSize?pObj.petalSize:9;
  const color = pObj.color?pObj.color:'';
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;
  const nodes = [];
  n0 = addNode({size: nodeSize, color: color});
  for (let i=0; i < numPetals; i++) {
    nodes[i] = circle({numNodes: petalSize, startNode: n0, color: color,
      edgeWidth: edgeWidth, nodeSize: nodeSize});
  }
  return n0;
}

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} barNodes DESC (default: 5).
 *   - @param {int} bellNodes DESC (default: 5).
 *   - @param {string} startNode DESC (default: '').
 *   - @param {string} color DESC (default: DEFAULTCOLOR).
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 * @return {DATATYPE} DESC.
 */
function dumbBell(pObj={}) {
  const barNodes = pObj.barNodes?pObj.barNodes:5;
  const bellNodes = pObj.bellNodes?pObj.bellNodes:5;
  const startNode = pObj.startNode?pObj.startNode:'';
  const color = pObj.color?pObj.color:DEFAULTCOLOR;
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;

  let n = circle({numNodes: petalSize, startNode: n0, color: color,
    edgeWidth: edgeWidth, nodeSize: nodeSize});

  n = line({numNodes: barNodes, startNode: n, color: color,
    edgeWidth: edgeWidth, nodeSize: nodeSize});
  circle({numNodes: petalSize, startNode: n0, color: color,
    edgeWidth: edgeWidth, nodeSize: nodeSize});
  return n;
}

/**
 * DESC.
 * @param {obj} pObj - An object containing the parameters:
 *   - @param {int} numNodes DESC (default: 11).
 *   - @param {string} startNode DESC (default: '').
 *   - @param {string} color DESC (default: DEFAULTCOLOR).
 *   - @param {int} edgeWidth DESC (default: DEFAULTEDGEWIDTH).
 *   - @param {int} nodeSize DESC (default: DEFAULTNODESIZE).
 * @return {DATATYPE} DESC.
 */
function infinitySymbol(pObj={}) {
  const numNodes = pObj.numNodes?pObj.numNodes:11;
  const startNode = pObj.startNode?pObj.startNode:'';
  const color = pObj.color?pObj.color:DEFAULTCOLOR;
  const edgeWidth = pObj.edgeWidth?pObj.edgeWidth:DEFAULTEDGEWIDTH;
  const nodeSize = pObj.nodeSize?pObj.nodeSize:DEFAULTNODESIZE;

  const n0 = (startNode?startNode:addNode({size: nodeSize, color: color}));
  circle({numNodes: numNodes, startNode: n0, color: color,
    edgeWidth: edgeWidth, nodeSize: nodeSize});
  circle({numNodes: numNodes, startNode: n0, color: color,
    edgeWidth: edgeWidth, nodeSize: nodeSize});

  return n0;
}

// circle({numNodes: 10, color: 'pink', edgeWidth: 10, nodeSize: 20});
// wheel({numNodes: 20});
// mesh({numNodes: 20, connectionPercent: 20, color: 'random'});
sun({bodyNodes: 7, rayNodes: 5});
// daisy({numPetals: 9, petalSize: 11, color: 'red'});
// infinitySymbol({numNodes: 10, color: 'green'});

// dumbBell({barNodes: 5, bellNodes: 6});
// flower(15, 10);
// snowflake({tier1: 9, tier2: 3});

// for (let i=0; i < 1000; i++) addNode({size: rndInt(40)+10});

// logNodes();
// logEdges();

// logSigma();

logVis();
