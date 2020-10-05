---
title: Example 2
lang: de
---

# Beispielseite 2

Diese Seite ist auf deutsch.
Zurück zum [Beispiel 1](example-1.html)

---

## Nützliche UTF-8 Chars

### Für Checklisten

☐ nothing so far  
🔳 nothing so far  

☑ all OK  
✓ all OK  
✔ all OK  
✅ all OK  
❎ all OK  
☒ all OK (?)  

✕ bad  
✖ bad  
✗ bad  
✘ bad  
❌bad  

### Diverse

⛭ just a cog  
⚠ Attention  
⛔ Do not enter  
🌐 Earth

### Beispiel

- 🔳 implement feature foo
- ❌ implement feature bar
- ✅ implement feature baz
- 🔳 implement feature bat
- 🔳 write tests
- ✅ compile package
- 🔳 deploy package
- ⛔ fail to meet the deadline

---

Hier noch ein diff als Beispiel

```diff
diff --git a/docs/www/css/style.css b/docs/www/css/style.css
index a0b00ff..d4a3c3e 100644
--- a/docs/www/css/style.css
+++ b/docs/www/css/style.css
@@ -15,12 +15,36 @@ body {
     box-sizing: border-box;
 }
 
-a, article, aside, blockquote, body, code, dd, div, dl, dt, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, legend, li, main, nav, ol, p, pre, section, table, td, textarea, th, tr, ul {
+a, article, aside, blockquote, body, code, dd, div, dl, dt, fieldset,
+figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, legend, li,
+main, nav, ol, p, pre, section, table, td, textarea, th, tr, ul {
     box-sizing: border-box;
 }
 
 hr {
-    border-top-color: hsla(0,0%,100%,.1)
+    border: none;
+    border-top: 1px solid #666;
+}
+
+table {
+    border-collapse: collapse;
+}
+
+tr:nth-child(2n) {
+    background-color: rgb(32, 34, 35);
+}
+
+tr:hover {
+    background-color: rgb(44, 47, 48);
+}
+
+th, td {
+    text-align: left;
+    border: 1px solid rgb(59, 62, 64);
+    padding: 0.5rem;
+}
+th {
+    background-color: #24292d;
 }
 
 dt {
@@ -35,9 +59,11 @@ a code {
     color: #2196f3;
 }
 
+
+/* layout */
+
 .page {
     display: block;
-    /* padding-bottom: 2rem; */
 }
 .mtime {
     max-width: 1200px;
@@ -70,9 +96,13 @@ a code {
 }
 
 .content img {
-    max-width: 100%
+    max-width: 100%;
+    border-radius: 6px;
 }
 
+
+/* code blocks */
+
 .content pre[class*=language-] {
     border-radius: 6px;
     padding-top: 2.5rem;
```