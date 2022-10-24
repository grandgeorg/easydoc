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
      tagCloud: {
        tags: [],
      },
      pageCards: []
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
      close.setAttribute('tabindex', '0');
      close.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;
      close.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const eventClose = new Event("closeModal", {bubbles: true});
        close.dispatchEvent(eventClose);
        if (!state.global.currentInputIsMouse) {
          state.tagNavigation.openButton.focus();
        }
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

      if (!state.global.currentInputIsMouse) {
        close.focus();
      }

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

    function addSelectedTag(tag) {
      state.selectedTags.push(tag);
      localStorage.setItem('selectedTags', JSON.stringify(state.selectedTags));
    }

    function setSelectedTagsFromLocalStore() {
      const selectedTags = JSON.parse(localStorage.getItem('selectedTags'));
      if (selectedTags) {
        state.selectedTags = selectedTags;
      }
    }

    function registerTagNavigation() {

      const openButton = document.querySelector('#open-tag-navigation');
      if (openButton) {
        state.tagNavigation = {
          openButton: openButton,
        };
        openButton.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          setSelectedTagsFromLocalStore();

          const modalBodyContent = document.createElement('div');
          modalBodyContent.setAttribute('class', 'modal-body-content');

          // tagcloud header
          const tagCloudHeader = document.createElement('div');
          tagCloudHeader.setAttribute('class', 'tag-cloud-header');


          // tagcloud filter
          const tagCloudFilter = document.createElement('div');
          tagCloudFilter.setAttribute('class', 'tag-cloud-filter');

          const tagCloudFilterLabel = document.createElement('label');
          tagCloudFilterLabel.setAttribute('for', 'tag-cloud-filter-input');
          tagCloudFilterLabel.setAttribute('class', 'filter-label');
          tagCloudFilterLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
            </svg>`;

          const tagCloudFilterInput = document.createElement('input');
          tagCloudFilterInput.setAttribute('type', 'text');
          tagCloudFilterInput.setAttribute('id', 'tag-cloud-filter-input');
          tagCloudFilterInput.setAttribute('class', 'filter-input');
          tagCloudFilterInput.setAttribute('placeholder', 'Filter tags, use comma to separate');
          tagCloudFilterInput.setAttribute('autocomplete', 'off');
          tagCloudFilterInput.setAttribute('autocorrect', 'off');
          tagCloudFilterInput.setAttribute('autocapitalize', 'off');
          tagCloudFilterInput.setAttribute('spellcheck', 'false');
          tagCloudFilterInput.addEventListener('input', function (e) {
            const filter = e.target.value.toLowerCase();
            const words = filter.split(',');
            for (let i = 0; i < words.length; i++) {
              words[i] = words[i].trim();
            }
            state.tagCloud.tags.forEach(function (tag) {
              tag.dispatchEvent(new CustomEvent("filterTagcloud", {detail: {words: words}}));
            });
          });

          tagCloudFilter.appendChild(tagCloudFilterLabel);
          tagCloudFilter.appendChild(tagCloudFilterInput);
          tagCloudHeader.appendChild(tagCloudFilter);

          // tagcloud sort
          const tagCloudSort = document.createElement('div');
          tagCloudSort.setAttribute('class', 'tag-cloud-sort');

          const tagCloudSortLabel = document.createElement('label');
          tagCloudSortLabel.setAttribute('for', 'tag-cloud-sort-select');
          tagCloudSortLabel.setAttribute('class', 'sort-label');
          tagCloudSortLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
              <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
            </svg><span class="description">sort by</span>`;


          const tagCloudOrderSelect = document.createElement('select');
          tagCloudOrderSelect.setAttribute('id', 'tag-cloud-sort-select');
          tagCloudOrderSelect.setAttribute('class', 'sort-select');
          tagCloudOrderSelect.innerHTML = `
            <option value="name">name</option>
            <option value="count">count</option>`;
            tagCloudOrderSelect.addEventListener('change', (event) => {
            // const sortValue = event.target.value;
            // const tagCloud = document.querySelector('.tag-cloud');
            // const tagCloudItems = tagCloud.querySelectorAll('.tag-cloud-item');
            // const tagCloudItemsArray = Array.from(tagCloudItems);
            // const sortedTagCloudItems = tagCloudItemsArray.sort((a, b) => {
            //   if (sortValue === 'name') {
            //     return a.innerText.localeCompare(b.innerText);
            //   } else if (sortValue === 'count') {
            //     return b.dataset.count - a.dataset.count;
            //   }
            // });
          });

          const tagCloudOrderLabel = document.createElement('label');
          tagCloudOrderLabel.setAttribute('for', 'tag-cloud-sort-order');
          tagCloudOrderLabel.setAttribute('class', 'order-label');
          tagCloudOrderLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
              <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
            </svg><span class="description">order</span>`;

          const tagCloudSortOrder = document.createElement('select');
          tagCloudSortOrder.setAttribute('id', 'tag-cloud-sort-order');
          tagCloudSortOrder.setAttribute('class', 'order-select');
          tagCloudSortOrder.innerHTML = `
            <option value="asc">ascending</option>
            <option value="desc">descending</option>`;
          tagCloudSortOrder.addEventListener('change', (event) => {
            // const sortOrder = event.target.value;
            // const tagCloud = document.querySelector('.tag-cloud');
            // const tagCloudItems = tagCloud.querySelectorAll('.tag-cloud-item');
            // const tagCloudItemsArray = Array.from(tagCloudItems);
            // const sortedTagCloudItems = tagCloudItemsArray.sort((a, b) => {
            //   if (sortOrder === 'asc') {
            //     return a.innerText.localeCompare(b.innerText);
            //   } else if (sortOrder === 'desc') {
            //     return b.innerText.localeCompare(a.innerText);
            //   }
            // });
          });

          const inputGroupSort = document.createElement('div');
          inputGroupSort.setAttribute('class', 'input-group');
          inputGroupSort.appendChild(tagCloudSortLabel);
          inputGroupSort.appendChild(tagCloudOrderSelect);

          const inputGroupOrder = document.createElement('div');
          inputGroupOrder.setAttribute('class', 'input-group');
          inputGroupOrder.appendChild(tagCloudOrderLabel);
          inputGroupOrder.appendChild(tagCloudSortOrder);

          tagCloudSort.appendChild(inputGroupSort);
          tagCloudSort.appendChild(inputGroupOrder);

          tagCloudHeader.appendChild(tagCloudSort);


          // tagcloud
          const tagCloud = document.createElement('div');
          tagCloud.setAttribute('class', 'tag-cloud');

          state.meta.tags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.setAttribute('class', 'tag');
            if (state.selectedTags.includes(tag.lcname)) {
              tagButton.classList.add('active');
            }
            tagButton.setAttribute('data-tag', tag.lcname);
            tagButton.innerHTML = `<span class="tag-name">${tag.name}</span><span class="tag-count">${tag.count}</span>`;
            tagButton.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              const tagElements = document.querySelectorAll(`[data-tag="${tag.lcname}"]`);
              tagElements.forEach(tagElement => {
                tagElement.classList.toggle('active');
              });
              if (tagButton.classList.contains('active')) {
                addSelectedTag(tag.lcname);
              } else {
                state.selectedTags = state.selectedTags.filter(item => item !== tag.lcname);
              }
              updateTagNavigation();
            });
            tagButton.addEventListener('filterTagcloud', function (e) {
              console.log(e.detail.words);
              if (e.detail.words.length === 0) {
                tagButton.classList.remove('hidden');
              } else {
                let show = false;
                e.detail.words.forEach(function (word) {
                  if (tag.lcname.indexOf(word) !== -1) {
                    show = true;
                  }
                });
                if (show) {
                  tagButton.classList.remove('hidden');
                } else {
                  tagButton.classList.add('hidden');
                }
              }
            }, false);
            state.tagCloud.tags.push(tagButton);
            tagCloud.appendChild(tagButton);
          });

          // -------------


          // page filter
          const pageFilter = document.createElement('div');
          pageFilter.setAttribute('class', 'page-filter');

          const pageFilterLabel = document.createElement('label');
          pageFilterLabel.setAttribute('for', 'page-filter-input');
          pageFilterLabel.setAttribute('class', 'filter-label');
          pageFilterLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
            </svg>`;

          const pageFilterInput = document.createElement('input');
          pageFilterInput.setAttribute('type', 'text');
          pageFilterInput.setAttribute('id', 'page-filter-input');
          pageFilterInput.setAttribute('class', 'filter-input');
          pageFilterInput.setAttribute('placeholder', 'Filter by title and filename, use comma to separate');
          pageFilterInput.setAttribute('autocomplete', 'off');
          pageFilterInput.setAttribute('autocorrect', 'off');
          pageFilterInput.setAttribute('autocapitalize', 'off');
          pageFilterInput.setAttribute('spellcheck', 'false');
          pageFilterInput.addEventListener('input', function (e) {
            const filter = e.target.value.toLowerCase();
            const words = filter.split(',');
            for (let i = 0; i < words.length; i++) {
              words[i] = words[i].trim();
            }
            state.pageCards.forEach(function (pageCard) {
              pageCard.dispatchEvent(new CustomEvent("filterPageCards", {detail: {words: words}}));
            });
          });

          pageFilter.appendChild(pageFilterLabel);
          pageFilter.appendChild(pageFilterInput);

          // page navigation
          const tagNavigation = document.createElement('div');
          tagNavigation.setAttribute('class', 'tag-navigation');

          state.meta.pages.forEach(page => {

            const pageCard = document.createElement('div');
            pageCard.setAttribute('class', 'page-card');
            pageCard.setAttribute('id', 'page-' + page.file);
            pageCard.innerHTML = `
              <a href="${page.file}" class="page-card-title">${page.title}</a>
              <a href="${page.file}" class="page-card-filename">${page.file}</a>
            `;
            pageCard.addEventListener('filterPageCards', function (e) {
              console.log(e.detail.words);
              if (e.detail.words.length === 0) {
                pageCard.classList.remove('filter-hidden');
              } else {
                let show = false;
                e.detail.words.forEach(function (word) {
                  if (page.title.indexOf(word) !== -1 || page.file.indexOf(word) !== -1) {
                    show = true;
                  }
                });
                if (show) {
                  pageCard.classList.remove('filter-hidden');
                } else {
                  pageCard.classList.add('filter-hidden');
                }
              }
            }, false);

            if (page.tags && Array.isArray(page.tags) && page.tags.length > 0) {

              const tags = document.createElement('div');
              tags.setAttribute('class', 'tags');

              page.tags.forEach(tag => {

                const lcTag = tag.toLowerCase();
                const tagElement = document.createElement('button');
                tagElement.dataset.tag = lcTag;
                tagElement.setAttribute('class', 'tag');
                if (state.selectedTags.includes(lcTag)) {
                  tagElement.classList.add('active');
                }
                tagElement.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16">
                    <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                    <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
                  </svg>` + tag;
                tagElement.addEventListener('click', function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  const tagElements = document.querySelectorAll(`[data-tag="${lcTag}"]`);
                  tagElements.forEach(tagElement => {
                    tagElement.classList.toggle('active');
                  });
                  if (tagElement.classList.contains('active')) {
                    addSelectedTag(lcTag);
                  } else {
                    state.selectedTags = state.selectedTags.filter(item => item !== lcTag);
                  }
                  updateTagNavigation();
                  // updateTagFilter();
                });
                tags.appendChild(tagElement);
              });
              pageCard.appendChild(tags);
            }
            state.pageCards.push(pageCard);
            tagNavigation.appendChild(pageCard);
          });

          // put it all together
          const tagCloudDetails = document.createElement('details');
          tagCloudDetails.setAttribute('class', 'tag-cloud-details');
          tagCloudDetails.setAttribute('open', 'open');
          tagCloudDetails.innerHTML = `<summary>Tags</summary>`;

          tagCloudDetails.appendChild(tagCloudHeader);
          tagCloudDetails.appendChild(tagCloud);

          const tagNavigationDetails = document.createElement('details');
          tagNavigationDetails.setAttribute('class', 'tag-navigation-details');
          tagNavigationDetails.setAttribute('open', 'open');
          tagNavigationDetails.innerHTML = `<summary>Pages</summary>`;
          tagNavigationDetails.appendChild(pageFilter);
          tagNavigationDetails.appendChild(tagNavigation);

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
              state.selectedTags.includes(tag.lcname) &&
              tag.files.includes(page.file) &&
              !hidden.includes(page.file) &&
              pageCard.classList.contains('hidden')
            ) {
              pageCard.classList.remove('hidden');
              // console.log('with', tag.name, 'show', page.file);
            } else if (
              state.selectedTags.includes(tag.lcname) &&
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
