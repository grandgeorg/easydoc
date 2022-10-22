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
      },
      meta: easydocMeta,
      selectedTags: [],
    };

    const elMenuToggle = document.querySelector(".burger");
    const elMain = document.querySelector("main");
    const elNavigationDrawer = document.querySelector(".navigation-drawer");
    const elContainer = document.querySelector(".content");
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-button");
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
        },
        purgeListeners: function () {
          listeners = [];
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
          addModal(lightBox, true);
        });
      });
    }

    function addModal(content, addClose) {

      const modal = document.createElement('div');
      if (addClose) {
        modal.setAttribute('class', 'modal open cp');
      } else {
        modal.setAttribute('class', 'modal open');
      }
      modal.appendChild(content);
      document.body.appendChild(modal);

      const closeModal = () => {
        modal.classList.add('willclose');
        // remove modal after animation
        setTimeout(() => {
          // document.body.removeChild(modal);
          modal.remove();
        }, 250);
      };

      setTimeout(function () {
        modal.classList.remove('open');
        if (addClose) {
          modal.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
          });
        }
        // close on esacpe
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            closeModal();
          }
        });
        // close on closeModal event
        document.addEventListener('closeModal', function (e) {
          closeModal();
        });
      }, 250);

    }

    function addModalDialog(bodyContent, headerContent) {

      const dialog = document.createElement('div');
      dialog.setAttribute('class', 'modal-dialog');
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'modal-title');

      const content = document.createElement('div');
      content.setAttribute('class', 'modal-content');

      const header = document.createElement('div');
      header.setAttribute('class', 'modal-header');

      const dialogTitle = document.createElement('h2');
      dialogTitle.setAttribute('id', 'modal-title');
      dialogTitle.setAttribute('class', 'modal-title');
      dialogTitle.innerHTML = headerContent;

      const close = document.createElement('button');
      close.setAttribute('type', 'button');
      close.setAttribute('class', 'modal-close');
      close.setAttribute('data-dismiss', 'modal');
      close.setAttribute('aria-label', 'Close');
      close.innerHTML = `<svg width="20" height="20" class="bi" fill="currentColor">
      <use xlink:href="assets/bootstrap-icons.svg#x"></use>
      </svg>`;
      close.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const eventClose = new Event("closeModal", {bubbles: true});
        close.dispatchEvent(eventClose);
      });

      document.body.addEventListener("click", function (e) {
        if (clickOutsideModalDialog(e, dialog)) {
          const eventClose = new Event("closeModal", {bubbles: true});
          close.dispatchEvent(eventClose);
        }
      });

      const body = document.createElement('div');
      body.setAttribute('class', 'modal-body');
      body.appendChild(bodyContent);


      header.appendChild(dialogTitle);
      header.appendChild(close);
      content.appendChild(header);
      content.appendChild(body);
      dialog.appendChild(content);

      addModal(dialog, false);

    }

    function clickOutsideModalDialog(event, elements, ignoreClass) {
      if (!Array.isArray(elements)) {
        elements = [elements];
      }
      if (ignoreClass && event.target.classList.contains(ignoreClass)) {
        return false;
      }
      return !elements.some(function (element) {
        return event.target === element || element.contains(event.target);
      });
    }

    function registerTagNavigation() {

      const openButton = document.querySelector('#open-tag-navigation');
      if (openButton) {
        openButton.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          const modalBodyContent = document.createElement('div');
          modalBodyContent.setAttribute('class', 'modal-body-content');

          const tagCloud = document.createElement('div');
          tagCloud.setAttribute('class', 'tag-cloud');
          state.meta.tags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.setAttribute('class', 'tag');
            if (state.selectedTags.includes(tag.name)) {
              tagButton.classList.add('active');
            }
            // tagButton.setAttribute('type', 'button');
            tagButton.setAttribute('data-tag', tag.name);
            tagButton.innerHTML = `<span class="tag-name">${tag.name}</span><span class="tag-count">${tag.count}</span>`;
            tagButton.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              const tagElements = document.querySelectorAll(`[data-tag="${tag.name}"]`);
              tagElements.forEach(tagElement => {
                tagElement.classList.toggle('active');
              });
              if (tagButton.classList.contains('active')) {
                state.selectedTags.push(tag.name);
              } else {
                state.selectedTags = state.selectedTags.filter(item => item !== tag.name);
              }
              updateTagNavigation();
            });
            tagCloud.appendChild(tagButton);
          });

          const tagNavigation = document.createElement('div');
          tagNavigation.setAttribute('class', 'tag-navigation');
          state.meta.pages.forEach(result => {

            const pageCard = document.createElement('div');
            pageCard.setAttribute('class', 'page-card');
            pageCard.setAttribute('id', 'page-' + result.file);
            pageCard.innerHTML = `
              <a href="${result.file}" class="page-card-title">${result.title}</a>
              <a href="${result.file}" class="page-card-filename">${result.file}</a>
            `;

            if (result.tags && Array.isArray(result.tags) && result.tags.length > 0) {

              const tags = document.createElement('div');
              tags.setAttribute('class', 'tags');
              result.tags.forEach(tag => {
                const tagElement = document.createElement('button');
                tagElement.dataset.tag = tag;
                tagElement.setAttribute('class', 'tag');
                // if state.selectedTags.includes(tag) add class active
                if (state.selectedTags.includes(tag)) {
                  tagElement.classList.add('active');
                }
                tagElement.innerHTML = `<svg width="20" height="20" class="bi" fill="currentColor">
                <use xlink:href="assets/bootstrap-icons.svg#tag"></use>
                </svg>` + tag;
                // add click event
                tagElement.addEventListener('click', function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  // tagElement.classList.toggle('active');
                  // select all elemants with data-tag == tag
                  const tagElements = document.querySelectorAll(`[data-tag="${tag}"]`);
                  tagElements.forEach(tagElement => {
                    tagElement.classList.toggle('active');
                  });
                  if (tagElement.classList.contains('active')) {
                    state.selectedTags.push(tag);
                  } else {
                    state.selectedTags = state.selectedTags.filter(item => item !== tag);
                  }
                  updateTagNavigation();
                  // updateTagFilter();
                });
                tags.appendChild(tagElement);
              });
              pageCard.appendChild(tags);
            }

            tagNavigation.appendChild(pageCard);
          });

          const tagNavigationDetails = document.createElement('details');
          tagNavigationDetails.setAttribute('class', 'tag-navigation-details');
          tagNavigationDetails.setAttribute('open', 'open');
          tagNavigationDetails.innerHTML = `<summary>Pages</summary>`;
          tagNavigationDetails.appendChild(tagNavigation);

          const tagCloudDetails = document.createElement('details');
          tagCloudDetails.setAttribute('class', 'tag-cloud-details');
          tagCloudDetails.setAttribute('open', 'open');
          tagCloudDetails.innerHTML = `<summary>Tags</summary>`;
          tagCloudDetails.appendChild(tagCloud);

          modalBodyContent.appendChild(tagCloudDetails);
          modalBodyContent.appendChild(tagNavigationDetails);

          addModalDialog(modalBodyContent, state.meta.t[document.documentElement.lang].tagNav);
          updateTagNavigation();
        });
      }
    }

    function updateTagNavigation() {
      // console.log(state.selectedTags);
      // iterate over state.pages
      state.meta.pages.forEach(page => {
        const pageCard = document.getElementById('page-' + page.file);
        if (state.selectedTags.length === 0) {
          pageCard.classList.remove('hidden');
        } else {
          let hidden = [];
          state.meta.tags.forEach(tag => {
            if (
              state.selectedTags.includes(tag.name) &&
              tag.files.includes(page.file) &&
              !hidden.includes(page.file) &&
              pageCard.classList.contains('hidden')
            ) {
              pageCard.classList.remove('hidden');
              // console.log('with', tag.name, 'show', page.file);
            } else if (
              state.selectedTags.includes(tag.name) &&
              !tag.files.includes(page.file)
            ) {
              hidden.push(page.file);
              if (!pageCard.classList.contains('hidden')) {
                pageCard.classList.add('hidden');
                // console.log('with', tag.name, 'hide', page.file);
              }
            }
          });
        }
      });
    }



    function main() {
      // addIdsToHeadings();
      addFlowcharts();
      addLightBox();
      dispatchNavigation();
      registerTagNavigation();
    }

    main();

  });
}());
