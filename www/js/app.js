// ------------------------------------------------
// Grandgeorg Websolutions
// Package: EasyDoc
// License: MIT
// ------------------------------------------------
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {

    const state = {
      global: {
        lastActiveElement: Element | null,
        currentInputIsMouse: false
      },
      nav: {
        isOpen: false,
        ps: pubsub(),
        ignoreClickOutsideClass: ["ignore_click_outside"]
      }
    };

    const elMenuToggle = document.querySelector(".burger");
    const elMain = document.querySelector("main");
    const elNavigationDrawer = document.querySelector(".navigation-drawer");
    const elContainer = document.querySelector(".content");
    const toggleBurger = burger();

    function pubsub() {
      let listeners = [];
      return Object.freeze({
        subscribe: function (listener) {
          listeners.push(listener);
        },
        notify: function (msg) {
          listeners.forEach(function (listener) {
            listener(msg);
          });
        }
      });
    }

    function burger() {
      const eventOpen = new Event("open");
      const eventClose = new Event("close");

      function toggleBurger(event) {
        event.stopPropagation();
        state.nav.isOpen = !state.nav.isOpen;
        if (state.nav.isOpen) {
          state.nav.ps.notify("open");
          elMenuToggle.classList.add("open");
          elMenuToggle.setAttribute("aria-expanded", true);
          elMenuToggle.dispatchEvent(eventOpen);
        } else {
          state.nav.ps.notify("close");
          elMenuToggle.classList.remove("open");
          elMenuToggle.setAttribute("aria-expanded", false);
          elMenuToggle.dispatchEvent(eventClose);
        }
      }
      return toggleBurger;
    }

    function toggleNavigation() {
      return function (msg) {
        if (msg === "open") {
          // Important: only display drawer if nav is open,
          // else tabnavigation will tab to invisible nav links
          elNavigationDrawer.style.display = "flex";
          setTimeout(function () {
            window.requestAnimationFrame(function () {
              elNavigationDrawer.style.transform = "translateX(0)";
              if (elContainer) {
                if (window.innerWidth >= (elNavigationDrawer.offsetWidth * 2)) {
                  elMain.style.marginRight = elNavigationDrawer.offsetWidth + "px";
                } else {
                  elMain.style.marginRight = 0;
                }
              }
            });
          }, 60);
        } else if (msg === "close") {
          elNavigationDrawer.style.transform = "translateX(100%)";
          elMain.style.marginRight = 0;
          setTimeout(function () {
            elNavigationDrawer.style.display = "none";
          }, 500);
        }
      };
    }

    // function clickOutside(event, elements) {
    //   if (!Array.isArray(elements)) {
    //     elements = [elements];
    //   }
    //   if (event.target.classList.contains(state.nav.ignoreClickOutsideClass)) {
    //     return false;
    //   }
    //   return !elements.some(function (element) {
    //     return event.target === element || element.contains(event.target);
    //   });
    // }

    function toggleMouseUse() {
      state.global.lastActiveElement = document.activeElement;
      if (document.body) {
        document.body.classList.toggle("intent-mouse", state.global.currentInputIsMouse);
      }
    }

    function dispatchNavigation() {
      if (!elMenuToggle) {
        return;
      }
      elMenuToggle.addEventListener("click", toggleBurger, false);
      state.nav.ps.subscribe(toggleNavigation());

      const elTocLinks = document.querySelectorAll(".toc a");
      elTocLinks.forEach(function (elTocLink) {
        elTocLink.addEventListener("click", function (event) {
          event.preventDefault();
          const elTarget = document.querySelector(event.target.hash);
          if (elTarget) {
            elTarget.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
          if (window.innerWidth < (elNavigationDrawer.offsetWidth * 2)) {
            toggleBurger(event);
          }
        });
      });

      // autoclose on click outside & clode on select from menu:
      // document.body.addEventListener("click", function (event) {
      //   if (clickOutside(event, elMenuToggle) && state.nav.isOpen) {
      //     toggleBurger(event);
      //   }
      // });

      document.addEventListener(
        "mousedown",
        function () {
          state.global.currentInputIsMouse = true;
          if (state.global.lastActiveElement === document.activeElement) {
            toggleMouseUse();
          }
        },
        { capture: true }
      );
      document.addEventListener(
        "keydown",
        function () {
          state.global.currentInputIsMouse = false;
        },
        { capture: true }
      );
      document.addEventListener("focusin", toggleMouseUse, { capture: true });
    }

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

    // function addIdsToHeadings() {
    //   const headings = ['h1', 'h2', 'h3', 'h4', 'h5'];
    //   headings.forEach(heading => {
    //     let elementList = document.querySelectorAll(heading);
    //     elementList.forEach((element, idx) => {
    //       element.setAttribute('id', heading + '_' + idx);
    //     });
    //   });
    // }

    function addLightBox() {
      const images = document.querySelectorAll('img');
      images.forEach(image => {
        image.addEventListener('click', function (e) {
          e.preventDefault();

          const img = document.createElement('img');
          img.setAttribute('src', image.getAttribute('src'));
          img.setAttribute('alt', image.getAttribute('alt'));

          const caption = document.createElement('div');
          caption.setAttribute('class', 'caption');
          caption.innerHTML = image.getAttribute('alt');

          const lightBox = document.createElement('div');
          lightBox.setAttribute('class', 'lightbox');
          lightBox.appendChild(img);
          lightBox.appendChild(caption);
          addModal(lightBox);
        });
      });
    }

    function addModal(content) {

      const modal = document.createElement('div');
      modal.setAttribute('class', 'modal open');
      document.body.appendChild(modal);

      const modalContent = document.createElement('div');
      modalContent.setAttribute('class', 'modal-content');
      modalContent.appendChild(content);
      modal.appendChild(modalContent);

      setTimeout(function () {
        modal.classList.remove('open');
        modal.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          modal.classList.add('willclose');
          // remove modal after animation
          setTimeout(function () {
              modal.remove();
          }, 250);
        });
      }, 250);

    }


    function main() {
      // addIdsToHeadings();
      addFlowcharts();
      addLightBox();
      dispatchNavigation();
    }

    main();

  });
}());
