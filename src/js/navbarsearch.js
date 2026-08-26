"use strict";

import { createSearchCore } from "./searchCore.js";

(function () {
  const mountPoint = document.getElementById("navbar-search");
  if (
    !mountPoint ||
    typeof Vue === "undefined" ||
    typeof easydocMeta === "undefined" ||
    !easydocMeta.config.navbar_search
  ) {
    return;
  }

  const { createApp, ref, watch, onMounted, onBeforeUnmount } = Vue;

  const lang =
    document.documentElement.lang && easydocMeta.t[document.documentElement.lang]
      ? document.documentElement.lang
      : easydocMeta.config.lang_fallback || "en";
  const t = easydocMeta.t[lang] || easydocMeta.t.en;

  createApp({
    setup() {
      const core = createSearchCore(Vue, t, lang, { syncUrl: false, initShowAll: false });
      const isOpen = ref(false);

      function openModal() {
        isOpen.value = true;
      }

      function closeModal() {
        isOpen.value = false;
      }

      // Typing into the navbar input reveals the results modal.
      watch(core.query, function (value) {
        if (value) {
          isOpen.value = true;
        }
      });

      // Lift the navbar above the modal backdrop so the input stays usable.
      watch(isOpen, function (open) {
        document.body.classList.toggle("navbar-search-open", open);
      });

      function onBackdropClick(event) {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }

      function onKeydown(event) {
        if (event.key === "Escape" && isOpen.value) {
          closeModal();
        }
      }

      onMounted(function () {
        document.addEventListener("keydown", onKeydown);
      });

      onBeforeUnmount(function () {
        document.removeEventListener("keydown", onKeydown);
        document.body.classList.remove("navbar-search-open");
      });

      return Object.assign({}, core, {
        isOpen,
        openModal,
        closeModal,
        onBackdropClick,
      });
    },
    template: /*html*/ `
      <div class="navbar-search">
        <label class="filter-label" for="navbar-search-input" :title="t.dashboard_search_placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </label>
        <input
          id="navbar-search-input"
          class="filter-input navbar-search-input"
          type="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :placeholder="t.navbar_search"
          :aria-label="t.navbar_search"
          v-model="query"
          @focus="openModal">
        <button
          class="dashboard-clear navbar-search-clear"
          type="button"
          v-if="query"
          :title="t.dashboard_clear"
          :aria-label="t.dashboard_clear"
          @click="clearQuery">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z"/>
          </svg>
        </button>

        <teleport to="body">
          <div class="modal open navbar-search-modal" v-if="isOpen" @click="onBackdropClick">
            <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="navbar-search-modal-title">
              <div class="modal-content">
                <div class="modal-header">
                  <h2 id="navbar-search-modal-title" class="modal-title">{{ t.navbar_search }}</h2>
                  <div class="modal-controls">
                    <button
                      class="modal-reset dashboard-clear"
                      type="button"
                      v-if="query"
                      :title="t.dashboard_clear"
                      :aria-label="t.dashboard_clear"
                      @click="clearQuery">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z"/>
                      </svg>
                    </button>
                    <button
                      class="modal-close"
                      type="button"
                      :aria-label="t.dashboard_clear"
                      @click="closeModal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="modal-body">
                  <div class="dashboard-summary" v-if="hasSummary">
                    <div class="dashboard-summary-group" v-if="tagSummary.length">
                      <div class="dashboard-summary-title">
                        {{ t.dashboard_summary_tags }}<span class="summary-count">{{ tagSummary.length }}</span>
                      </div>
                      <div class="tags">
                        <button
                          type="button"
                          class="tag"
                          v-for="item in tagSummary"
                          :key="item.key"
                          :class="{ partial: item.partial, required: isRequired(item.key) }"
                          :aria-pressed="isRequired(item.key) ? 'true' : 'false'"
                          :title="chipTitle(item.key, item.partial)"
                          @click="toggleRequired(item.key)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16">
                            <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                            <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
                          </svg>{{ item.name }}<span class="tag-count">{{ item.count }}</span>
                        </button>
                      </div>
                    </div>

                    <div class="dashboard-summary-group" v-if="titleFileSummary.length">
                      <div class="dashboard-summary-title">
                        {{ t.dashboard_summary_titlefile }}<span class="summary-count">{{ titleFileSummary.length }}</span>
                      </div>
                      <div class="tags">
                        <button
                          type="button"
                          class="token"
                          v-for="item in titleFileSummary"
                          :key="item.key"
                          :class="{ required: isRequired(item.key) }"
                          :aria-pressed="isRequired(item.key) ? 'true' : 'false'"
                          :title="chipTitle(item.key)"
                          @click="toggleRequired(item.key)">
                          <mark>{{ item.token }}</mark><span class="tag-count">{{ item.count }}</span>
                        </button>
                      </div>
                    </div>

                    <div class="dashboard-summary-group" v-if="fulltextSummary.length">
                      <div class="dashboard-summary-title">
                        {{ t.dashboard_summary_fulltext }}<span class="summary-count">{{ fulltextSummary.length }}</span>
                      </div>
                      <div class="tags">
                        <button
                          type="button"
                          class="token"
                          v-for="item in fulltextSummary"
                          :key="item.key"
                          :class="{ required: isRequired(item.key) }"
                          :aria-pressed="isRequired(item.key) ? 'true' : 'false'"
                          :title="chipTitle(item.key)"
                          @click="toggleRequired(item.key)">
                          {{ item.token }}<span class="tag-count">{{ item.count }}</span><span class="score-chip">{{ item.score }}</span>
                        </button>
                      </div>
                    </div>

                    <div class="dashboard-note" v-if="fulltextUnavailable">{{ t.dashboard_fulltext_unavailable }}</div>
                  </div>

                  <div class="dashboard-result-count" v-if="results.length">{{ results.length }} {{ t.dashboard_results }}</div>

                  <div class="dashboard-empty" v-if="!results.length">{{ emptyMessage }}</div>

                  <div class="tag-navigation dashboard-pages" v-else>
                    <div class="page-card" v-for="item in results" :key="item.page.file">
                      <a :href="item.page.file">
                        <div class="page-card-title">
                          <template v-for="(segment, index) in item.titleSegments" :key="index"
                            ><mark v-if="segment.match">{{ segment.text }}</mark><template v-else>{{ segment.text }}</template
                          ></template>
                        </div>
                        <div class="page-card-filename">
                          <template v-for="(segment, index) in item.fileSegments" :key="index"
                            ><mark v-if="segment.match">{{ segment.text }}</mark><template v-else>{{ segment.text }}</template
                          ></template>
                        </div>
                        <div class="page-card-date">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                          </svg>{{ item.date }}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe2" viewBox="0 0 16 16">
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
                          </svg>{{ item.page.lang.toUpperCase() }}
                          <span class="score-chip" v-if="item.score > 0" :title="t.dashboard_score">{{ item.score.toFixed(2) }}</span>
                        </div>
                      </a>
                      <div class="tags" v-if="item.page.tags && item.page.tags.length">
                        <button
                          type="button"
                          class="tag"
                          v-for="tag in item.page.tags"
                          :key="tag"
                          :data-tag="tag.toLowerCase()"
                          :class="{ active: isSelected(tag) }"
                          @click.prevent.stop="toggleTag(tag)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                            <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                          </svg>{{ tag }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </teleport>
      </div>
    `,
  }).mount("#navbar-search");
})();
