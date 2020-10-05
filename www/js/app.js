(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    const flowcharts = document.querySelectorAll(".flowchart");
    let chart;
    flowcharts.forEach((fl, idx) => {
      fl.setAttribute('id', 'flowchart_' + idx);
      chart = flowchart.parse(fl.textContent);
      fl.innerHTML = '';
      chart.drawSVG('flowchart_' + idx,
        {
          'x': 0,
          'y': 0,
          'line-width': 2,
          'line-length': 50,
          'text-margin': 10,
          'font-size': 14,
          'font-family': '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
          'font-color': '#8DA1AC',
          'line-color': '#8DA1AC',
          'element-color': 'white',
          'fill': 'black',
          'yes-text': 'yes',
          'no-text': 'no',
          'arrow-end': 'block',
          'scale': 1,
          'symbols': {
            start: {
              'class': 'start-element',
              'font-color': 'white',
              'fill': '#2F495F',
              'line-width': '0px'
            },
            end: {
              'class': 'end-element',
              'font-color': 'white',
              'fill': '#2F495F',
              'line-width': '0px'
            },
            operation: {
              'class': 'operation-element',
              'font-color': 'white',
              'fill': '#00BC7D',
              'line-width': '0px',
            },
            inputoutput: {
              'class': 'inputoutput-element',
              'font-color': 'white',
              'fill': '#EB4D5D',
              'line-width': '0px'
            },
            subroutine: {
              'class': 'subroutine-element',
              'font-color': 'white',
              'fill': '#937AC4',
              'element-color': '#fff',
              'line-color': 'red'
            },
            condition: {
              'class': 'condition-element',
              'font-color': 'white',
              'fill': '#FFB500',
              'line-width': '0px'
            },
            parallel: {
              'class': 'parallel-element',
              'font-color': 'white',
              'fill': '#2F495F',
              'line-width': '0px'
            }
          }
      // {
      //   'flowstate': {
      //     'past': {
      //       'fill': '#CCCCCC',
      //       'font-size': 12
      //     },
      //     'current': {
      //       'fill': 'yellow',
      //       'font-color': 'red',
      //       'font-weight': 'bold'
      //     },
      //     'future': {
      //       'fill': '#FFFF99'
      //     },
      //     'request': {
      //       'fill': 'blue'
      //     },
      //     'invalid': {
      //       'fill': '#444444'
      //     },
      //     'approved': {
      //       'fill': '#58C4A3',
      //       'font-size': 12,
      //       'yes-text': 'APPROVED',
      //       'no-text': 'n/a'
      //     },
      //     'rejected': {
      //       'fill': '#C45879',
      //       'font-size': 12,
      //       'yes-text': 'n/a',
      //       'no-text': 'REJECTED'
      //     }
      //   }
      // }
        }
      );
    });
  });
}());
