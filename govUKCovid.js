const axios = require('axios');

const getPaginatedData = async ( filters, structure ) => {
  const endpoint = 'https://api.coronavirus.data.gov.uk/v1/data';
  const apiParams = {
    filters: filters.join(';'),
    structure: JSON.stringify(structure),
  };
  const result = [];

  let nextPage = null;
  let currentPage = 1;

  do {
    const {data, status, statusText} = await axios.get(endpoint, {
      params: {
        ...apiParams,
        page: currentPage,
      },
      timeout: 10000,
    });

    if ( status >= 400 ) {
      throw Error(statusText);
    }

    if ( 'pagination' in data ) {
      nextPage = data.pagination.next || null;
    }
    result.push(...data.data);

    currentPage ++;
  } while ( nextPage );

  return result;
}; // getData

const main = async () => {
  const filterEng = [
    `areaType=region`,
    // `areaType=utla`,
  ];

  const structEng = {
    date: 'date',
    name: 'areaName',
    cases: {
      new: 'newCasesBySpecimenDate',
      cumulative: 'cumCasesBySpecimenDate',
    },
    deaths: {
      // new: 'newDeathsByDeathDate',
      new: 'newDeaths28DaysByDeathDate',
      // cumulative: 'cumDeathsByDeathDate',
      cumulative: 'cumDeaths28DaysByDeathDate',
    },
  };

  const filterUK = [
    `areaType=nation`,
    // `areaType=utla`,
  ];

  const structUK = {
    date: 'date',
    name: 'areaName',
    cases: {
      new: 'newCasesByPublishDate',
      cumulative: 'cumCasesByPublishDate',
    },
    deaths: {
      // new: 'newDeathsByDeathDate',
      new: 'newDeaths28DaysByDeathDate',
      // cumulative: 'cumDeathsByDeathDate',
      cumulative: 'cumDeaths28DaysByDeathDate',
    },
  };

  // const structUK = {
  //   date: 'date',
  //   male: 'maleCases',
  //   female: 'femaleCases',
  // };

  const resultsEng = await getPaginatedData(filterEng, structEng);

  console.log('da,rg,c,ct,d,dt');
  for (i=0; i< resultsEng.length; i++) {
    console.log(
        resultsEng[i].date + ',' +
        resultsEng[i].name.replace(',', '') + ',' +
        resultsEng[i].cases.new + ',' +
        resultsEng[i].cases.cumulative + ',' +
        resultsEng[i].deaths.new + ',' +
        resultsEng[i].deaths.cumulative);
  }

  const resultsUK = await getPaginatedData(filterUK, structUK);

  for (i=0; i< resultsUK.length; i++) {
    if (resultsUK[i].name != 'England') {
      console.log(
          resultsUK[i].date + ',' +
          resultsUK[i].name.replace(',', '') + ',' +
          resultsUK[i].cases.new + ',' +
          resultsUK[i].cases.cumulative + ',' +
          resultsUK[i].deaths.new + ',' +
          resultsUK[i].deaths.cumulative);
    }
  }

}; // main

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
