---
# General smoke page; page info with tags (e2e/page-info.spec.js).
# "1. Digit heading" has an ID starting with a digit, as produced with an empty
# EASYDOC_HEADING_ID_PREFIX (not a valid CSS selector; e2e/links.spec.js).
lang: en
title: Fixture Home
tags:
  - Alpha
  - Beta
---

# Fixture Home

A small page used by the EasyDoc end-to-end tests.

## Code

```js
const answer = 42;
```

## Container

:::tip
A tip container.
:::

## Test Links

- [Link to no-tags page](no-tags.md)
- [Link to no-tags heading](no-tags.md#t-fixture-no-tags)
- [External Markdown file](https://example.com/readme.md)
- https://google.de

## 1. Digit heading {#1-digit-heading}

Its TOC link must scroll here.