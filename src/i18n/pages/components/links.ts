import type { Locale } from '../../index';

export const linksPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    plain: { title: string; description: string };
    muted: { title: string; description: string };
    subtle: { title: string; description: string };
    inline: { title: string; description: string };
    externalLink: { title: string; description: string };
    navigationList: { title: string; description: string };
    cardLinks: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Links — Cubby UI',
    description: 'Styled anchor links with multiple variants — underlined, plain, muted, and subtle — for different contexts.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-link</code> to an anchor element for a styled inline link with underline and hover transition.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      variants: {
        title: 'Variants',
        description: 'Four link styles for different use cases. <code class="cu-code">cu-link</code> (default with underline), <code class="cu-code">cu-link-plain</code> (underline on hover only), <code class="cu-code">cu-link-muted</code> (muted color, no underline), <code class="cu-code">cu-link-subtle</code> (foreground color, turns primary on hover).',
      },
      plain: {
        title: 'Plain',
        description: 'Use <code class="cu-code">cu-link cu-link-plain</code> for links that only show an underline on hover. Cleaner for navigation-heavy areas.',
      },
      muted: {
        title: 'Muted',
        description: 'Use <code class="cu-code">cu-link cu-link-muted</code> for de-emphasized links such as footer links or secondary navigation. Text brightens to foreground on hover.',
      },
      subtle: {
        title: 'Subtle',
        description: 'Use <code class="cu-code">cu-link cu-link-subtle</code> for links that blend with body text and reveal their primary color on hover.',
      },
      inline: {
        title: 'Inline',
        description: 'Links blend naturally within paragraph text.',
      },
      externalLink: {
        title: 'External Link',
        description: 'Add <code class="cu-code">cu-link-external</code> for links that open in a new tab. Pairs well with an external-link icon to signal the behavior.',
      },
      navigationList: {
        title: 'Navigation List',
        description: 'Combine <code class="cu-code">cu-link-muted</code> with a list for sidebar or footer navigation.',
      },
      cardLinks: {
        title: 'Card Links',
        description: 'Use <code class="cu-code">cu-link-subtle</code> inside cards for a clean, understated link list.',
      },
    },
    classDescriptions: {
      'cu-link': 'Base link style with underline and hover transition',
      'cu-link-plain': 'No-underline link, underline appears on hover',
      'cu-link-muted': 'Soft-colored link, darkens on hover',
      'cu-link-subtle': 'Inline link blending with body text, primary color on hover',
      'cu-link-external': 'External link, inline-flex layout with icon',
    },
  },
  'zh-tw': {
    title: 'Links — Cubby UI',
    description: '多種變體的錨點連結樣式 — 底線、純文字、柔和、低調 — 適用於不同情境。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-link</code> 套用至錨點元素，建立帶有底線和 hover 過渡效果的行內連結。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      variants: {
        title: '變體',
        description: '四種連結樣式適用於不同場景。<code class="cu-code">cu-link</code>（預設帶底線）、<code class="cu-code">cu-link-plain</code>（hover 時才顯示底線）、<code class="cu-code">cu-link-muted</code>（柔和色彩、無底線）、<code class="cu-code">cu-link-subtle</code>（前景色，hover 時轉為主色）。',
      },
      plain: {
        title: 'Plain',
        description: '使用 <code class="cu-code">cu-link cu-link-plain</code> 設定僅在 hover 時顯示底線的連結。適合導航密集的區域。',
      },
      muted: {
        title: 'Muted',
        description: '使用 <code class="cu-code">cu-link cu-link-muted</code> 設定低調連結，如頁尾連結或次要導航。hover 時文字亮度提升至前景色。',
      },
      subtle: {
        title: 'Subtle',
        description: '使用 <code class="cu-code">cu-link cu-link-subtle</code> 設定與內文融合的連結，hover 時顯示主色。',
      },
      inline: {
        title: '行內',
        description: '連結自然融入段落文字中。',
      },
      externalLink: {
        title: '外部連結',
        description: '加入 <code class="cu-code">cu-link-external</code> 設定在新分頁開啟的連結。搭配外部連結圖示可提示使用者行為。',
      },
      navigationList: {
        title: '導航列表',
        description: '將 <code class="cu-code">cu-link-muted</code> 與列表組合，用於側邊欄或頁尾導航。',
      },
      cardLinks: {
        title: '卡片連結',
        description: '在卡片中使用 <code class="cu-code">cu-link-subtle</code>，呈現簡潔低調的連結列表。',
      },
    },
    classDescriptions: {
      'cu-link': '基礎連結樣式，帶有底線和 hover 過渡效果',
      'cu-link-plain': '無底線連結，hover 時顯示底線',
      'cu-link-muted': '柔和色彩連結，hover 時加深',
      'cu-link-subtle': '與內文融合的行內連結，hover 時顯示主色',
      'cu-link-external': '外部連結，inline-flex 佈局搭配圖示',
    },
  },
};
