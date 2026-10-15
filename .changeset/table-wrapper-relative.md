---
"cubby-ui": patch
---

**Table** `cu-table-wrapper` 加上 `position: relative`，表格內的 `sr-only` 等絕對定位元素改以捲動容器為定位基準，不再跑出容器撐寬整頁，造成窄螢幕出現水平捲動
