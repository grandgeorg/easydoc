(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    function addFlowcharts(params) {
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
          }
        );
      });
    }

    function addIdsToHeadings() {
      const headings = ['h1', 'h2', 'h3', 'h4', 'h5'];
      headings.forEach(heading => {
        let elementList = document.querySelectorAll(heading);
        elementList.forEach((element, idx) => {
          element.setAttribute('id', heading + '_' + idx);
        });
      });
    }

    function addLightBox() {
      const images = document.querySelectorAll('img');
      images.forEach(image => {
        // image.setAttribute('data-lightbox', 'image');
        // add event handler to open lightbox
        image.addEventListener('click', function (e) {
          e.preventDefault();
          // copy image to lightbox
          // const lightbox = document.querySelector('#lightbox');
          // lightbox.innerHTML = '';
          // lightbox.appendChild(img);

          const img = document.createElement('img');
          img.setAttribute('src', image.getAttribute('src'));
          addModal(img);
        });
      });
    }

    // add modal
    function addModal(content) {
      // add modal to body
      const modal = document.createElement('div');
      // modal.setAttribute('id', 'modal');
      modal.setAttribute('class', 'modal');
      document.body.appendChild(modal);
      // add modal content
      const modalContent = document.createElement('div');
      modalContent.setAttribute('class', 'modal-content');
      modal.appendChild(modalContent);

      // // add close button
      // const close = document.createElement('div');
      // close.setAttribute('class', 'close');
      // close.innerHTML = '&times;';
      // modal.appendChild(close);

      // add content
      modalContent.appendChild(content);
      // add event handler to close modal
      modal.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // add willclose class to modal
        modal.classList.add('willclose');
        // remove modal after animation
        setTimeout(function () {
            modal.remove();
        }, 250);
      });
    }


    function main() {
      addIdsToHeadings();
      addFlowcharts();
      addLightBox();
    }

    main();

  });
}());
