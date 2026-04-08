import type { Locale } from '../../index';

export const diffViewerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sideBySide: { title: string; description: string };
    hunk: { title: string; description: string };
    wordLevel: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Diff Viewer — Cubby UI',
    description: 'Displays code differences in a unified or side-by-side view with line numbers, hunk headers, and word-level highlighting.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Build a unified diff view with <code class="cu-code">cu-diff-viewer</code> container, a header showing the filename, and individual diff lines.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sideBySide: {
        title: 'Side by Side',
        description: 'Use <code class="cu-code">cu-diff-viewer-side-by-side</code> to display the old and new file content in two columns for easier comparison.',
      },
      hunk: {
        title: 'Hunk Headers',
        description: 'Use <code class="cu-code">cu-diff-viewer-hunk</code> to display hunk markers (e.g. <code class="cu-code">@@ -1,7 +1,8 @@</code>) that separate logical sections of changes.',
      },
      wordLevel: {
        title: 'Word-Level Highlighting',
        description: 'Use <code class="cu-code">cu-diff-viewer-word-added</code> and <code class="cu-code">cu-diff-viewer-word-removed</code> within line content to highlight specific changed words.',
      },
    },
    classDescriptions: {
      'cu-diff-viewer': 'Container for the diff viewer',
      'cu-diff-viewer-header': 'Header bar displaying file info',
      'cu-diff-viewer-filename': 'Filename text inside the header',
      'cu-diff-viewer-hunk': 'Hunk separator line (e.g. @@ ... @@)',
      'cu-diff-viewer-line': 'Individual diff line row',
      'cu-diff-viewer-line-number': 'Line number cell',
      'cu-diff-viewer-line-content': 'Line content cell',
      'cu-diff-viewer-line-added': 'Added line (green background)',
      'cu-diff-viewer-line-removed': 'Removed line (red background)',
      'cu-diff-viewer-line-unchanged': 'Unchanged context line',
      'cu-diff-viewer-side-by-side': 'Side-by-side two-column layout modifier',
      'cu-diff-viewer-side': 'Individual side panel in side-by-side view',
      'cu-diff-viewer-word-added': 'Inline word-level addition highlight',
      'cu-diff-viewer-word-removed': 'Inline word-level removal highlight',
    },
  },
  'zh-tw': {
    title: 'Diff Viewer — Cubby UI',
    description: '以統一或並排檢視方式顯示程式碼差異，支援行號、hunk 標頭與字詞級高亮。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-diff-viewer</code> 容器建立統一差異檢視，搭配顯示檔名的標頭及各差異行。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sideBySide: {
        title: '並排檢視',
        description: '使用 <code class="cu-code">cu-diff-viewer-side-by-side</code> 將新舊檔案內容以雙欄方式呈現，方便比較。',
      },
      hunk: {
        title: 'Hunk 標頭',
        description: '使用 <code class="cu-code">cu-diff-viewer-hunk</code> 顯示 hunk 標記（如 <code class="cu-code">@@ -1,7 +1,8 @@</code>），用來分隔不同的變更區段。',
      },
      wordLevel: {
        title: '字詞級高亮',
        description: '在行內容中使用 <code class="cu-code">cu-diff-viewer-word-added</code> 和 <code class="cu-code">cu-diff-viewer-word-removed</code> 來標示特定變更的字詞。',
      },
    },
    classDescriptions: {
      'cu-diff-viewer': 'Diff 檢視器容器',
      'cu-diff-viewer-header': '顯示檔案資訊的標頭列',
      'cu-diff-viewer-filename': '標頭內的檔名文字',
      'cu-diff-viewer-hunk': 'Hunk 分隔行（如 @@ ... @@）',
      'cu-diff-viewer-line': '個別差異行',
      'cu-diff-viewer-line-number': '行號欄位',
      'cu-diff-viewer-line-content': '行內容欄位',
      'cu-diff-viewer-line-added': '新增行（綠色背景）',
      'cu-diff-viewer-line-removed': '刪除行（紅色背景）',
      'cu-diff-viewer-line-unchanged': '未變更的上下文行',
      'cu-diff-viewer-side-by-side': '並排雙欄佈局修飾類別',
      'cu-diff-viewer-side': '並排檢視中的單側面板',
      'cu-diff-viewer-word-added': '行內字詞級新增高亮',
      'cu-diff-viewer-word-removed': '行內字詞級刪除高亮',
    },
  },
};
