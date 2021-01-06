/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

const axios = require('axios');

const clog = (...args) => {console.log(args);}
const timeMS = (prevTime = 0) => {return Date.now() - prevTime;}

const STARTTIME = timeMS();

// Function defined ASYNC so that functions inside can be invoked with an AWAIT.
const fetchData = async (label) => {
  clog(timeMS(STARTTIME), 'fetchData', label, 'begin');
  const result = await axios.get('https://www.bbc.co.uk/news');
  clog(timeMS(STARTTIME), 'fetchData', label, 'end');
  return result.data;
};

clog(timeMS(STARTTIME), 'main', 'begin');
const res1=fetchData(1);
const res2=fetchData(2);
const res3=fetchData(3);
clog(timeMS(STARTTIME), 'main', 'fetchData 1,2,3 invoked');

// Declare anonymous ASYNC function to wrap AWAIT function calls.
(async () => {
  // I don't expect these to finish in the order I invoked them but it doesn't
  // actually matter.  If, say, res2 finishes before res1 then as soon a res1
  // finishes and we then move to AWAIT res2, res2 will return immediately.
  await res1;
  clog(timeMS(STARTTIME), 'main', 'fetchData 1 finished');
  await res2;
  clog(timeMS(STARTTIME), 'main', 'fetchData 2 finished');
  await res3;
  clog(timeMS(STARTTIME), 'main', 'fetchData 3 finished');
})(); // The () after the definition executes the anonymous function.

clog(timeMS(STARTTIME), 'main', 'end (outside await)');
