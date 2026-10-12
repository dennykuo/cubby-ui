---
"cubby-ui": patch
---

安全性

- **Deploy Docs** 只在本 repo 的 push 觸發的 CI 成功後部署：`workflow_run` 的 `branches: [main]` 比對的是來源分支名稱，fork 若以名為 `main` 的分支開 PR，其 CI 完成後同樣會觸發部署並 checkout fork 的 commit；`build` job 條件新增 `workflow_run.event == 'push'` 與 `head_repository.full_name == github.repository`
