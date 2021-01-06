/* eslint-disable require-jsdoc */

// Load the Visualization API and the core chart package.
google.charts.load('current', {'packages': ['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

/**
 * Callback that creates and populates a data table, instantiates the chart,
 * passes in the data and draws it.
 */
function drawChart() {
  // Create the data table.
  window.gData = new google.visualization.DataTable();
  window.gOptions = {
    'width': 800,
    'height': 600,
    'chartArea': {'width': '100%', 'height': '80%', 'left': 50, 'right': 120},
  };

  // Instantiate and draw our chart, passing in some options.
  window.gChart =
    new google.visualization.LineChart(document.getElementById('chartDiv'));

  // Add sample data
  addSampleData();
  changeChart('line');
}

/**
 * A function to add sample data to the google chart data table.
 *
 * @param {string} setName - The name of a dataset.
 */
function addSampleData(setName) {
  switch (setName) {
    case 'column':
      window.gChart =
        new google.visualization.ColumnChart(
            document.getElementById('chartDiv'));
      break;
    default:
      document.getElementById('dataValues').value =
        ',Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec\n' +
        'Amsterdam,3.4,3.5,6.1,9.1,12.9,15.4,17.6,17.5,14.7,11,7.1,4\n' +
        'Athens,9.8,10.1,12.2,16,21,25.9,28.7,28.4,24.1,19.2,14.7,11.1\n' +
        'Berlin,0.6,2.3,5.1,10.2,14.8,17.9,20.3,19.7,15.3,10.5,6,1.3\n' +
        'London,4.3,4.5,6.9,8.7,12.1,15.1,17.3,17,14.3,10.9,7.2,4.7\n' +
        'Madrid,6.3,7.9,11.2,12.9,16.7,22.2,25.6,25.1,20.9,15.1,9.9,6.9\n' +
        'Paris,4.9,5.6,8.8,11.4,15.1,18.2,20.4,20.2,16.9,12.9,8.1,5.4\n' +
        'Reykjavik,-0.5,0.4,0.5,2.9,6.3,9,10.6,10.3,7.4,4.4,1.1,-0.2\n' +
        'Rome,7.5,8.2,10.2,12.6,17.2,21.1,24.1,24.5,20.8,16.4,11.4,8.4';
  }
}

/**
 * A function to redraw the google chart as a new chart type.
 *
 * @param {string} chartType - The new chart type.
 */
// eslint-disable-next-line no-unused-vars
function changeChart(chartType) {
  switch (chartType) {
    case 'column':
      window.gChart =
        new google.visualization.ColumnChart(
            document.getElementById('chartDiv'));
      break;
    case 'bar':
      window.gChart =
        new google.visualization.BarChart(
            document.getElementById('chartDiv'));
      break;
    case 'area':
      window.gChart =
        new google.visualization.AreaChart(
            document.getElementById('chartDiv'));
      break;
    case 'pie':
      window.gChart =
        new google.visualization.PieChart(
            document.getElementById('chartDiv'));
      break;
    default:
      window.gChart =
        new google.visualization.LineChart(
            document.getElementById('chartDiv'));
  }
  redrawChart();
}

/**
 * A function
 *
 * @param {text} text - The text to copy to the clipboard
 */
function redrawChart() {
  let numCols;
  let cols;
  const sourceDataArr = [];
  const dataStr = document.getElementById('dataValues').value;
  const pivotData = (document.getElementById('pivotYesNo').value == 'Yes');
  const rowLabels = (document.getElementById('rowLabelsYesNo').value == 'Yes');
  const colLabels = (document.getElementById('colLabelsYesNo').value == 'Yes');

  // Remove any existing data from the chart.
  try {
    window.gData.removeRows(0, 9999);
  } catch {}
  try {
    window.gData.removeColumns(0, 9999);
  } catch {}

  // Load data from textbox to source data array.
  const rows = dataStr.split(/\n/);
  if (!colLabels) {
    rows.unshift('');
    for (col = 0; col < rows[1].split(',').length; col++) {
      rows[0] = rows[0] + 'col:'+col+',';
    }
  }
  if (!rowLabels) {
    for ( row = 0; row < rows.length; row++) {
      rows[row] = 'row:'+row+','+rows[row];
    }
  }
  const numRows = rows.length;
  for (let row = 0; row < rows.length; row++) {
    sourceDataArr[row] = [];
    cols = rows[row].split(',');
    numCols = cols.length;
    for (let col = 0; col < cols.length; col++) {
      sourceDataArr[row][col] = cols[col];
    }
  }

  // Add source data to to Google Data Table.
  window.gData.addColumn('string', 'ColumnName');
  if (!pivotData) {
    for (let col = 1; col < numCols; col++) {
      window.gData.addColumn('number', sourceDataArr[0][col]);
    }
  } else {
    for (let row = 1; row < numRows; row++) {
      window.gData.addColumn('number', sourceDataArr[row][0]);
    }
  }

  if (!pivotData) {
    const rowArr = [];
    for (let row = 1; row < numRows; row++) {
      rowArr.push(sourceDataArr[row][0]);
      for (let col = 1; col < numCols; col++) {
        rowArr.push(Number(sourceDataArr[row][col]));
      }
      window.gData.addRow(rowArr);
      rowArr.length = 0;
    }
  } else {
    const colArr = [];
    for (let col = 1; col < numCols; col++) {
      colArr.push(sourceDataArr[0][col]);
      for (let row = 1; row < numRows; row++) {
        colArr.push(Number(sourceDataArr[row][col]));
      }
      window.gData.addRow(colArr);
      colArr.length = 0;
    }
  }
  window.gChart.draw(window.gData, window.gOptions);
}
