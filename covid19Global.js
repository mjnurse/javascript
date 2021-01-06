/* eslint-disable require-jsdoc */

google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawCht);

const gChtData=[];
const gSelectedCountries= new Array(11);
for (let c=1; c<=10; c++) {
  gSelectedCountries[c] = 0;
}

gChtData[0] = gd[0];
gChtData[1] = gd[1];
for (let ctry=numCtrys+1; ctry<=numCtrys+10; ctry++) {
  gChtData[0][ctry] = '';
  gChtData[1][ctry] = 0;
}

let sc = 1;
for (let ctry=1; ctry<=numCtrys; ctry++) {
  let ctryBox = document.getElementById('ctryCb'+ctry);
  if (ctryBox != undefined && ctryBox.checked) {
    gSelectedCountries[sc] = ctry;
    sc += 1;
  }
}

for (let day=2; day<gd.length; day++) {
  gChtData[day] = [];
  for (let ctry=1; ctry<=numCtrys+10; ctry++) {
    gChtData[day][ctry] = null;
  }
}

function drawCht() {
  const form = document.getElementById('measureForm');
  const measure = form.elements['measure'].value;
  const statsTab = document.getElementById('statsTable');
  const chartTitle = document.getElementById('chartTitle');
  const tableTitle = document.getElementById('tableTitle');

  let title = '';
  switch (measure) {
    case '0': title = 'Cases Per Day'; break;
    case '1': title = 'Cases Total'; break;
    case '2': title = 'Deaths Per Day'; break;
    case '3': title = 'Deaths Total'; break;
    case '4': title = 'Cases Per Million Per Day'; break;
    case '5': title = 'Cases Per Million Total'; break;
    case '6': title = 'Deaths Per Million Per Day'; break;
    case '7': title = 'Deaths Per Million Total'; break;
  }
  chartTitle.innerHTML = title;
  tableTitle.innerHTML = title;

  for (let day=2; day<gd.length; day++) {
    gChtData[day][0] = gd[day][0];
    for (let ctry=1; ctry<=numCtrys; ctry++) {
      if (gd[day][ctry] == null) {
        gChtData[day][ctry] = null;
      } else {
        gChtData[day][ctry] = gd[day][ctry][measure];
      }
    }
  }
  let tab = '';
  let tabHdr = '';
  for (let day=0; day<gd.length; day++) {
    let tr = '';
    if (day != 1) {
      tr += '<tr style="font-size: 0.7em; line-height: 1em; padding: 2px">' +
          '<td><b>' + gChtData[day][0] + '</b></td>';
      for (let sel=1; sel<=10; sel++) {
        if (gSelectedCountries[sel] == 0) {
          if (day==0) {
            gChtData[day][numCtrys+sel] = '';
          } else if (day==1) {
            gChtData[day][numCtrys+sel] = 0;
          } else {
            gChtData[day][numCtrys+sel] = null;
          }
        } else {
          gChtData[day][numCtrys+sel] = gChtData[day][gSelectedCountries[sel]];
          if (day == 0) {
            tr += '<td><b>' + gChtData[day][numCtrys+sel] + '</b></td>';
          } else {
            tr += '<td>' + gChtData[day][numCtrys+sel] + '</td>';
          }
        }
      }
      tr += '</tr>';
    }
    if (day == 0) {
      tabHdr = tr;
    } else {
      tab = tr + tab;
    }
  }
  tab = '<table>' + tabHdr + tab + '</table>';
  statsTab.innerHTML = tab;

  const googleChtData = google.visualization.arrayToDataTable(gChtData);

  const chtOptions = {
    backgroundColor: '#FFFFFF',
    chartArea: {
      left: '6%',
      top: '2%',
      height: '90%',
      width: '88%',
    },
    pointsVisible: false,
    series: {
      200: {color: '#B82E2E'},
    },
    fontSize: 10,
    height: '100%',
    width: '100%',
    legend: 'bottom',
    hAxis: {showTextEvery: 7},
    vAxis: {viewWindow: {min: 0}},
    curveType: 'function',
  };

  chtOptions.series[numCtrys+1] = {color: '#3366CC'};
  chtOptions.series[numCtrys+2] = {color: '#DC3912'};
  chtOptions.series[numCtrys+3] = {color: '#FF9900'};
  chtOptions.series[numCtrys+4] = {color: '#109618'};
  chtOptions.series[numCtrys+5] = {color: '#990099'};
  chtOptions.series[numCtrys+6] = {color: '#3B3EAC'};
  chtOptions.series[numCtrys+7] = {color: '#0099C6'};
  chtOptions.series[numCtrys+8] = {color: '#DD4477'};
  chtOptions.series[numCtrys+9] = {color: '#66AA00'};
  chtOptions.series[numCtrys+10] = {color: '#B82E2E'};

  for (let c=0; c<=numCtrys; c++) {
    chtOptions.series[c] = {
      color: '#CCCCCC', lineWidth: 1, visibleInLegend: false};
  }
  for (let ctry=1; ctry<=10; ctry++) {
    if (gSelectedCountries[ctry] == 0) {
      chtOptions.series[numCtrys+ctry-1] =
          {lineWidth: 0, visibleInLegend: false};
    } else {
      chtOptions.series[numCtrys+ctry-1] =
          {lineWidth: 2, visibleInLegend: true};
    }
  }
  const chart = new google.visualization.LineChart(
      document.getElementById('gChart'));
  chart.draw(googleChtData, chtOptions);
}

// eslint-disable-next-line no-unused-vars
function ctryChange(chkBox) {
  ctryId = Number(chkBox.id.slice(6, 99));
  if (chkBox.checked) {
    let numChecked = 0;
    for (let i=1; i<=10; i++) {
      if (gSelectedCountries[i] != 0) {
        numChecked += 1;
      }
    }
    if (numChecked >= 10 ) {
      chkBox.checked = false;
      return false;
    }
    for (let i=1; i<=10; i++) {
      if ( gSelectedCountries[i] == 0 ) {
        gSelectedCountries[i] = ctryId;
        break;
      }
    }
  } else {
    for (let i=1; i<=10; i++) {
      if ( gSelectedCountries[i] == ctryId ) {
        gSelectedCountries[i] = 0;
      }
    }
  }
  drawCht();
}
