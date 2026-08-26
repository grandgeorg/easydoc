"use strict";

// Shared search logic for the auto-index dashboard and the navbar search modal.
// Both consume this factory so their search semantics stay identical: inclusive-OR
// matching over tag / title / filename / fulltext, per-token fulltext requests
// unioned client side, required-match chips and highlight segments.

const DEBOUNCE_MS = 300;

// Splits text into [{ text, match }] parts so matches can be rendered with
// plain interpolation instead of v-html.
export function segments(text, tokens) {
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

export function tokenize(value) {
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

export function makeFormatDate(lang) {
  return function formatDate(dateString) {
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
  };
}

// Builds the reactive state and handlers shared by every search UI.
// options:
//   syncUrl      mirror the query to ?q= and seed it from the URL (default true)
//   initShowAll  initial state of the "show all pages" switch (default from config)
export function createSearchCore(Vue, t, lang, options) {
  const { ref, computed, watch } = Vue;
  const opts = options || {};
  const syncUrl = opts.syncUrl !== false;
  const initShowAll =
    opts.initShowAll !== undefined
      ? Boolean(opts.initShowAll)
      : Boolean(easydocMeta.config.auto_index_init_show_all);

  const fulltextEnabled = Boolean(easydocMeta.config.enable_fulltext_search);
  const apiUrl = easydocMeta.config.easydoc_search_api_url;
  const formatDate = makeFormatDate(lang);

  const initialQuery = syncUrl ? new URL(window.location.href).searchParams.get("q") || "" : "";
  const query = ref(initialQuery);
  const activeQuery = ref(query.value);
  const fulltextByToken = ref({});
  const fulltextUnavailable = ref(false);
  const showAll = ref(initShowAll);
  const required = ref([]);

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
    if (syncUrl) {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set("q", value);
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState({}, "", url);
    }
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

  function hasFulltextHit(token, file) {
    const hits = fulltextByToken.value[token];
    return Boolean(
      hits &&
        hits.some(function (result) {
          return result.ref === file;
        })
    );
  }

  // A required chip key is "<kind>:<value>"; every required key has to match.
  function matchesRequired(key, page, pageTags, title, file) {
    const separator = key.indexOf(":");
    const kind = key.slice(0, separator);
    const value = key.slice(separator + 1);
    if (kind === "tag") {
      return pageTags.indexOf(value.toLowerCase()) !== -1;
    }
    if (kind === "titlefile") {
      return title.indexOf(value) !== -1 || file.indexOf(value) !== -1;
    }
    return hasFulltextHit(value, page.file);
  }

  const results = computed(function () {
    const list = tokens.value;
    if (!list.length && !showAll.value) {
      return [];
    }
    const requiredKeys = required.value;
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
      if (hit && requiredKeys.length) {
        hit = requiredKeys.every(function (key) {
          return matchesRequired(key, page, pageTags, title, file);
        });
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
        summary.push({ key: `tag:${tag.name}`, name: tag.name, count: tag.count, partial: !exact });
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
        summary.push({ key: `titlefile:${token}`, token: token, count: count });
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
      summary.push({ key: `fulltext:${token}`, token: token, count: hits.length, score: best.toFixed(2) });
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

  const summaryKeys = computed(function () {
    return tagSummary.value
      .map(function (item) {
        return item.key;
      })
      .concat(
        titleFileSummary.value.map(function (item) {
          return item.key;
        }),
        fulltextSummary.value.map(function (item) {
          return item.key;
        })
      );
  });

  // Chips disappear as the query changes, so drop the requirements they carried.
  watch(summaryKeys, function (keys) {
    const kept = required.value.filter(function (key) {
      return keys.indexOf(key) !== -1;
    });
    if (kept.length !== required.value.length) {
      required.value = kept;
    }
  });

  function isRequired(key) {
    return required.value.indexOf(key) !== -1;
  }

  function toggleRequired(key) {
    if (isRequired(key)) {
      required.value = required.value.filter(function (item) {
        return item !== key;
      });
    } else {
      required.value = required.value.concat([key]);
    }
  }

  function chipTitle(key, partial) {
    const action = isRequired(key) ? t.dashboard_require_off : t.dashboard_require_on;
    return partial ? `${t.dashboard_partial_tag} \u00b7 ${action}` : action;
  }

  const emptyMessage = computed(function () {
    if (!tokens.value.length && !showAll.value) {
      return t.dashboard_start_typing;
    }
    return t.dashboard_no_results;
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
    showAll,
    emptyMessage,
    tagSummary,
    titleFileSummary,
    fulltextSummary,
    hasSummary,
    fulltextUnavailable,
    isRequired,
    toggleRequired,
    chipTitle,
    isSelected,
    toggleTag,
    clearQuery,
  };
}
