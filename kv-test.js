const kv = require('./kv');

const rndInt = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

for (let i = 0; i < 10; i++) {
  kv.resolve('test', 1);
}

