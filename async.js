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
