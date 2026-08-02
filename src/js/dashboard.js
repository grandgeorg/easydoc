"use strict";

(function () {
  const mountPoint = document.getElementById("dashboard");
  if (!mountPoint || typeof Vue === "undefined" || typeof easydocMeta === "undefined") {
    return;
  }

  const { createApp, ref, computed, watch } = Vue;

  const DEBOUNCE_MS = 300;

  const lang =
    document.documentElement.lang && easydocMeta.t[document.documentElement.lang]
      ? document.documentElement.lang
      : easydocMeta.config.lang_fallback || "en";
  const t = easydocMeta.t[lang] || easydocMeta.t.en;

  const fulltextEnabled = Boolean(easydocMeta.config.enable_fulltext_search);
  const apiUrl = easydocMeta.config.easydoc_search_api_url;

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    if (lang === "de") {
      return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function tokenize(value) {
    const tokens = [];
    String(value || "")
      .toLowerCase()
      .split(/[\s,]+/)
      .forEach(function (token) {
        if (token && tokens.indexOf(token) === -1) {
          tokens.push(token);
        }
      });
    return tokens;
  }

  // Splits text into [{ text, match }] parts so matches can be rendered with
  // plain interpolation instead of v-html.
  function segments(text, tokens) {
    const value = String(text);
    if (!tokens.length) {
      return [{ text: value, match: false }];
    }
    const lower = value.toLowerCase();
    const ranges = [];
    tokens.forEach(function (token) {
      let from = lower.indexOf(token);
      while (from !== -1) {
        ranges.push([from, from + token.length]);
        from = lower.indexOf(token, from + 1);
      }
    });
    if (!ranges.length) {
      return [{ text: value, match: false }];
    }
    ranges.sort(function (a, b) {
      return a[0] - b[0];
    });
    const merged = [ranges[0]];
    for (let i = 1; i < ranges.length; i++) {
      const last = merged[merged.length - 1];
      if (ranges[i][0] <= last[1]) {
        last[1] = Math.max(last[1], ranges[i][1]);
      } else {
        merged.push(ranges[i]);
      }
    }
    const parts = [];
    let cursor = 0;
    merged.forEach(function (range) {
      if (range[0] > cursor) {
        parts.push({ text: value.slice(cursor, range[0]), match: false });
      }
      parts.push({ text: value.slice(range[0], range[1]), match: true });
      cursor = range[1];
    });
    if (cursor < value.length) {
      parts.push({ text: value.slice(cursor), match: false });
    }
    return parts;
  }

  createApp({
    setup() {
      const query = ref(new URL(window.location.href).searchParams.get("q") || "");
      const activeQuery = ref(query.value);
      const fulltextByToken = ref({});
      const fulltextUnavailable = ref(false);

      const tokens = computed(function () {
        return tokenize(activeQuery.value);
      });

      // searchApi.js joins terms with AND, so every token is queried on its own
      // and the hits are unioned client side.
      let requestId = 0;
      async function refreshFulltext(list) {
        if (!fulltextEnabled || !list.length) {
          fulltextByToken.value = {};
          fulltextUnavailable.value = false;
          return;
        }
        const currentRequest = ++requestId;
        try {
          const responses = await Promise.all(
            list.map(function (token) {
              return fetch(`${apiUrl}?q=${encodeURIComponent(token)}`).then(function (response) {
                if (!response.ok) {
                  throw new Error(`search api responded with ${response.status}`);
                }
                return response.json();
              });
            })
          );
          if (currentRequest !== requestId) {
            return;
          }
          const byToken = {};
          list.forEach(function (token, index) {
            byToken[token] = Array.isArray(responses[index]) ? responses[index] : [];
          });
          fulltextByToken.value = byToken;
          fulltextUnavailable.value = false;
        } catch (error) {
          if (currentRequest !== requestId) {
            return;
          }
          fulltextByToken.value = {};
          fulltextUnavailable.value = true;
        }
      }

      let debounceTimer = null;
      watch(query, function (value) {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(function () {
          activeQuery.value = value;
        }, DEBOUNCE_MS);
      });

      watch(activeQuery, function (value) {
        const url = new URL(window.location.href);
        if (value) {
          url.searchParams.set("q", value);
        } else {
          url.searchParams.delete("q");
        }
        window.history.replaceState({}, "", url);
        refreshFulltext(tokenize(value));
      });

      refreshFulltext(tokens.value);

      function fulltextScore(file) {
        let score = 0;
        tokens.value.forEach(function (token) {
          const hits = fulltextByToken.value[token];
          if (!hits) {
            return;
          }
          const hit = hits.find(function (result) {
            return result.ref === file;
          });
          if (hit && hit.score > score) {
            score = hit.score;
          }
        });
        return score;
      }

      const results = computed(function () {
        const list = tokens.value;
        const matched = [];
        easydocMeta.pages.forEach(function (page) {
          const pageTags = (page.tags || []).map(function (tag) {
            return tag.toLowerCase();
          });
          const title = page.title.toLowerCase();
          const file = page.file.toLowerCase();
          let hit = list.length === 0;
          list.forEach(function (token) {
            if (
              title.indexOf(token) !== -1 ||
              file.indexOf(token) !== -1 ||
              pageTags.some(function (tag) {
                return tag === token || tag.indexOf(token) === 0;
              })
            ) {
              hit = true;
            }
          });
          const score = fulltextScore(page.file);
          if (score > 0) {
            hit = true;
          }
          if (hit) {
            matched.push({
              page: page,
              score: score,
              date: formatDate(page.date),
              titleSegments: segments(page.title, list),
              fileSegments: segments(page.file, list),
            });
          }
        });
        const scored = matched.some(function (item) {
          return item.score > 0;
        });
        matched.sort(function (a, b) {
          if (scored && a.score !== b.score) {
            return b.score - a.score;
          }
          return new Date(b.page.date) - new Date(a.page.date);
        });
        return matched;
      });

      const tagSummary = computed(function () {
        const summary = [];
        tokens.value.forEach(function (token) {
          (easydocMeta.tags || []).forEach(function (tag) {
            const name = tag.lcname || tag.name.toLowerCase();
            const exact = name === token;
            if (!exact && name.indexOf(token) !== 0) {
              return;
            }
            const known = summary.find(function (item) {
              return item.name === tag.name;
            });
            if (known) {
              known.partial = known.partial && !exact;
              return;
            }
            summary.push({ name: tag.name, count: tag.count, partial: !exact });
          });
        });
        return summary;
      });

      const titleFileSummary = computed(function () {
        const summary = [];
        tokens.value.forEach(function (token) {
          let count = 0;
          easydocMeta.pages.forEach(function (page) {
            if (page.title.toLowerCase().indexOf(token) !== -1 || page.file.toLowerCase().indexOf(token) !== -1) {
              count++;
            }
          });
          if (count > 0) {
            summary.push({ token: token, count: count });
          }
        });
        return summary;
      });

      const fulltextSummary = computed(function () {
        const summary = [];
        tokens.value.forEach(function (token) {
          const hits = fulltextByToken.value[token];
          if (!hits || !hits.length) {
            return;
          }
          const best = hits.reduce(function (max, hit) {
            return hit.score > max ? hit.score : max;
          }, 0);
          summary.push({ token: token, count: hits.length, score: best.toFixed(2) });
        });
        return summary;
      });

      const hasSummary = computed(function () {
        return (
          tagSummary.value.length > 0 ||
          titleFileSummary.value.length > 0 ||
          fulltextSummary.value.length > 0 ||
          fulltextUnavailable.value
        );
      });

      function isSelected(tag) {
        return tokens.value.indexOf(tag.toLowerCase()) !== -1;
      }

      function toggleTag(tag) {
        const lcTag = tag.toLowerCase();
        const current = tokenize(query.value);
        if (current.indexOf(lcTag) !== -1) {
          query.value = current
            .filter(function (token) {
              return token !== lcTag;
            })
            .join(" ");
        } else {
          query.value = `${query.value.trim()} ${lcTag}`.trim();
        }
      }

      function clearQuery() {
        query.value = "";
      }

      return {
        t,
        query,
        tokens,
        results,
        tagSummary,
        titleFileSummary,
        fulltextSummary,
        hasSummary,
        fulltextUnavailable,
        isSelected,
        toggleTag,
        clearQuery,
      };
    },
    template: /*html*/ `
      <div class="dashboard-search">
        <label class="filter-label" for="dashboard-search-input" :title="t.dashboard_search_placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </label>
        <input
          id="dashboard-search-input"
          class="filter-input"
          type="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :placeholder="t.dashboard_search_placeholder"
          v-model="query">
        <button
          class="dashboard-clear"
          type="button"
          v-if="query"
          :title="t.dashboard_clear"
          :aria-label="t.dashboard_clear"
          @click="clearQuery">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z"/>
          </svg>
        </button>
      </div>

      <div class="dashboard-summary" v-if="hasSummary">
        <div class="dashboard-summary-group" v-if="tagSummary.length">
          <div class="dashboard-summary-title">
            {{ t.dashboard_summary_tags }}<span class="summary-count">{{ tagSummary.length }}</span>
          </div>
          <div class="tags">
            <span
              class="tag"
              v-for="item in tagSummary"
              :key="item.name"
              :class="{ partial: item.partial }"
              :title="item.partial ? t.dashboard_partial_tag : null">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16">
                <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
              </svg>{{ item.name }}<span class="tag-count">{{ item.count }}</span>
            </span>
          </div>
        </div>

        <div class="dashboard-summary-group" v-if="titleFileSummary.length">
          <div class="dashboard-summary-title">
            {{ t.dashboard_summary_titlefile }}<span class="summary-count">{{ titleFileSummary.length }}</span>
          </div>
          <div class="tags">
            <span class="token" v-for="item in titleFileSummary" :key="item.token">
              <mark>{{ item.token }}</mark><span class="tag-count">{{ item.count }}</span>
            </span>
          </div>
        </div>

        <div class="dashboard-summary-group" v-if="fulltextSummary.length">
          <div class="dashboard-summary-title">
            {{ t.dashboard_summary_fulltext }}<span class="summary-count">{{ fulltextSummary.length }}</span>
          </div>
          <div class="tags">
            <span class="token" v-for="item in fulltextSummary" :key="item.token">
              {{ item.token }}<span class="tag-count">{{ item.count }}</span><span class="score-chip" :title="t.dashboard_score">{{ item.score }}</span>
            </span>
          </div>
        </div>

        <div class="dashboard-note" v-if="fulltextUnavailable">{{ t.dashboard_fulltext_unavailable }}</div>
      </div>

      <div class="dashboard-result-count">{{ results.length }} {{ t.dashboard_results }}</div>

      <div class="dashboard-empty" v-if="!results.length">{{ t.dashboard_no_results }}</div>

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
    `,
  }).mount("#dashboard");
})();
