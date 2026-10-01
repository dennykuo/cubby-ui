/**
 * Shared component navigation data.
 * Single source of truth for Sidebar + PrevNext navigation.
 * Order here determines display order in sidebar and prev/next links.
 */
export interface NavItem {
  name: string;
  path: string;
}

export const gettingStarted: NavItem[] = [
  { name: "Getting Started", path: "/" },
  { name: "Usage", path: "/usage" },
  { name: "Laravel", path: "/laravel" },
  { name: "Theming", path: "/theming" },
  { name: "Dark Mode", path: "/dark-mode" },
  { name: "Playground", path: "/playground" },
];

export const layoutComponents: NavItem[] = [
  { name: "Container", path: "/components/container" },
  { name: "Filter Bar", path: "/components/filter-bar" },
  { name: "Header", path: "/components/header" },
  { name: "Kanban", path: "/components/kanban" },
  { name: "Nav", path: "/components/nav" },
  { name: "Page Header", path: "/components/page-header" },
  { name: "Resizable Panels", path: "/components/resizable-panels" },
  { name: "Scroll Area", path: "/components/scroll-area" },
  { name: "Sidebar", path: "/components/sidebar" },
  { name: "Toolbar", path: "/components/toolbar" },
];

export const basicComponents: NavItem[] = [
  { name: "Aspect Ratio", path: "/components/aspect-ratio" },
  { name: "Avatar", path: "/components/avatar" },
  { name: "Badge", path: "/components/badge" },
  { name: "Button", path: "/components/button" },
  { name: "Button Group", path: "/components/button-group" },
  { name: "Card", path: "/components/card" },
  { name: "Copy Button", path: "/components/copy-button" },
  { name: "Color", path: "/components/color" },
  { name: "Separator", path: "/components/separator" },
];

export const typographyComponents: NavItem[] = [
  { name: "Headings", path: "/components/headings" },
  { name: "Kbd", path: "/components/kbd" },
  { name: "Paragraphs", path: "/components/paragraphs" },
  { name: "Blockquote", path: "/components/blockquote" },
  { name: "Lists", path: "/components/lists" },
  { name: "Links", path: "/components/links" },
  { name: "Text", path: "/components/text" },
  { name: "HR", path: "/components/hr" },
];

export const navigationComponents: NavItem[] = [
  { name: "Breadcrumb", path: "/components/breadcrumb" },
  { name: "Menubar", path: "/components/menubar" },
  { name: "Pagination", path: "/components/pagination" },
  { name: "Segmented Control", path: "/components/segmented-control" },
  { name: "Speed Dial", path: "/components/speed-dial" },
  { name: "Steps", path: "/components/steps" },
  { name: "Tabs", path: "/components/tabs" },
  { name: "Back to Top", path: "/components/back-to-top" },
];

export const dataDisplayComponents: NavItem[] = [
  { name: "Accordion", path: "/components/accordion" },
  { name: "Chart", path: "/components/chart" },
  { name: "Code Block", path: "/components/code-block" },
  { name: "Collapsible", path: "/components/collapsible" },
  { name: "Data Table", path: "/components/data-table" },
  { name: "Setting Item", path: "/components/setting-item" },
  { name: "Sortable List", path: "/components/sortable-list" },
  { name: "Stat Card", path: "/components/stat-card" },
  { name: "Table", path: "/components/table" },
  { name: "Timeline", path: "/components/timeline" },
  { name: "Tree View", path: "/components/tree-view" },
];

export const contentComponents: NavItem[] = [
  { name: "Carousel", path: "/components/carousel" },
  { name: "Countdown", path: "/components/countdown" },
  { name: "Diff Viewer", path: "/components/diff-viewer" },
  { name: "Image Compare", path: "/components/image-compare" },
  { name: "Marquee", path: "/components/marquee" },
];

export const formComponents: NavItem[] = [
  { name: "Checkbox", path: "/components/checkbox" },
  { name: "Checkbox Group", path: "/components/checkbox-group" },
  { name: "Color Picker", path: "/components/color-picker" },
  { name: "Combobox", path: "/components/combobox" },
  { name: "Date Picker", path: "/components/date-picker" },
  { name: "Dropzone", path: "/components/dropzone" },
  { name: "File Input", path: "/components/file-input" },
  { name: "Floating Label", path: "/components/floating-label" },
  { name: "Form Group", path: "/components/form-group" },
  { name: "Input", path: "/components/input" },
  { name: "Input Group", path: "/components/input-group" },
  { name: "Label", path: "/components/label" },
  { name: "Multi Select", path: "/components/multi-select" },
  { name: "Number Input", path: "/components/number-input" },
  { name: "Password Input", path: "/components/password-input" },
  { name: "Pin Input", path: "/components/pin-input" },
  { name: "Radio", path: "/components/radio" },
  { name: "Range", path: "/components/range" },
  { name: "Rating", path: "/components/rating" },
  { name: "Search Input", path: "/components/search-input" },
  { name: "Select", path: "/components/select" },
  { name: "Tag Input", path: "/components/tag-input" },
  { name: "Textarea", path: "/components/textarea" },
  { name: "Toggle", path: "/components/toggle" },
  { name: "Toggle Group", path: "/components/toggle-group" },
  { name: "Transfer List", path: "/components/transfer-list" },
];

export const feedbackComponents: NavItem[] = [
  { name: "Alert", path: "/components/alert" },
  { name: "Empty State", path: "/components/empty-state" },
  { name: "Progress", path: "/components/progress" },
  { name: "Skeleton", path: "/components/skeleton" },
  { name: "Notification", path: "/components/notification" },
  { name: "Spinner", path: "/components/spinner" },
  { name: "Toast", path: "/components/toast" },
];

export const overlayComponents: NavItem[] = [
  { name: "Alert Dialog", path: "/components/alert-dialog" },
  { name: "Command Palette", path: "/components/command-palette" },
  { name: "Context Menu", path: "/components/context-menu" },
  { name: "Dialog", path: "/components/dialog" },
  { name: "Drawer", path: "/components/drawer" },
  { name: "Dropdown Menu", path: "/components/dropdown" },
  { name: "Hover Card", path: "/components/hover-card" },
  { name: "Popover", path: "/components/popover" },
  { name: "Tooltip", path: "/components/tooltip" },
  { name: "Tour", path: "/components/tour" },
];

export const aiComponents: NavItem[] = [
  { name: "Chat Bubble", path: "/components/chat-bubble" },
  { name: "Chat Input", path: "/components/chat-input" },
  { name: "Chat Typing", path: "/components/chat-typing" },
];

export const examplePages: NavItem[] = [
  { name: "Dashboard V1", path: "/examples/dashboard" },
  { name: "Dashboard V2", path: "/examples/dashboard-v2" },
  { name: "Dashboard V3", path: "/examples/dashboard-v3" },
  { name: "Dashboard V4", path: "/examples/dashboard-v4" },
  { name: "Dashboard V5", path: "/examples/dashboard-v5" },
  { name: "Form Wizard", path: "/examples/form-wizard" },
  { name: "Modal Workflow", path: "/examples/modal-workflow" },
];

/** All component groups in sidebar display order */
export const componentGroups = [
  { key: "layouts" as const, items: layoutComponents },
  { key: "basic" as const, items: basicComponents },
  { key: "typography" as const, items: typographyComponents },
  { key: "navigation" as const, items: navigationComponents },
  { key: "dataDisplay" as const, items: dataDisplayComponents },
  { key: "content" as const, items: contentComponents },
  { key: "forms" as const, items: formComponents },
  { key: "feedback" as const, items: feedbackComponents },
  { key: "overlay" as const, items: overlayComponents },
  { key: "ai" as const, items: aiComponents },
];

/** Flat ordered list of all component pages (for prev/next navigation) */
export const allComponentPages: NavItem[] = componentGroups.flatMap(
  (g) => g.items
);
