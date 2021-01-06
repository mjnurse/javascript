/* eslint-disable require-jsdoc */

google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawCht);

const gChtData=[];

gChtData[0] = gd[0];
gChtData[1] = gd[1];

for (let day=2; day<gd.length; day++) {
  gChtData[day] = [];
  for (let rgn=1; rgn<=numRgns; rgn++) {
    gChtData[day][rgn] = null;
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
    case '1': title = 'Cases Per Day'; break;
    case '2': title = 'Cases Total'; break;
    case '3': title = 'Cases 7 Day Average'; break;
    case '4': title = 'Deaths Per Day'; break;
    case '5': title = 'Deaths Total'; break;
    case '6': title = 'Deaths 7 Day Average'; break;
    case '7': title = 'Cases Per Million Per Day'; break;
    case '8': title = 'Cases Per Million Total'; break;
    case '9': title = 'Cases Per Million 7 Day Average'; break;
    case '10': title = 'Deaths Per Million Per Day'; break;
    case '11': title = 'Deaths Per Million Total'; break;
    case '12': title = 'Deaths Per Million 7 Day Average'; break;
  }
  chartTitle.innerHTML = title;
  tableTitle.innerHTML = title;

  for (let day=2; day<gd.length; day++) {
    gChtData[day][0] = gd[day][0];
    for (let rgn=1; rgn<=numRgns; rgn++) {
      if (gd[day][rgn] == null) {
        gChtData[day][rgn] = null;
      } else {
        gChtData[day][rgn] = gd[day][rgn][measure];
      }
    }
  }
  let tab = '';
  let tabHdr = '';
  for (let day=0; day<gd.length; day++) {
    let tr = '';
    if (day != 1) {
      tr += '<tr style="font-size: 0.7em; line-height: 1em; padding: 1px">' +
          '<td><b>' + gChtData[day][0] + '</b></td>';
      for (let rgn=1; rgn<=numRgns; rgn++) {
        tr += '<td>' + gChtData[day][rgn] + '</td>';
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
    hAxis: {showTextEvery: 28},
    vAxis: {viewWindow: {min: 0}},
    curveType: 'function',
  };

  const chart = new google.visualization.LineChart(
      document.getElementById('gChart'));
  chart.draw(googleChtData, chtOptions);
}
