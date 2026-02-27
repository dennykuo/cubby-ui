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
  { name: "Theming", path: "/theming" },
  { name: "Dark Mode", path: "/dark-mode" },
  { name: "Playground", path: "/playground" },
];

export const layoutComponents: NavItem[] = [
  { name: "Container", path: "/components/container" },
  { name: "Filter Bar", path: "/components/filter-bar" },
  { name: "Header", path: "/components/header" },
  { name: "Nav", path: "/components/nav" },
  { name: "Page Header", path: "/components/page-header" },
  { name: "Scroll Area", path: "/components/scroll-area" },
  { name: "Sidebar", path: "/components/sidebar" },
  { name: "Toolbar", path: "/components/toolbar" },
];

export const basicComponents: NavItem[] = [
  { name: "Button", path: "/components/button" },
  { name: "Button Group", path: "/components/button-group" },
  { name: "Card", path: "/components/card" },
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
  { name: "Steps", path: "/components/steps" },
  { name: "Tabs", path: "/components/tabs" },
];

export const dataDisplayComponents: NavItem[] = [
  { name: "Accordion", path: "/components/accordion" },
  { name: "Avatar", path: "/components/avatar" },
  { name: "Badge", path: "/components/badge" },
  { name: "Collapsible", path: "/components/collapsible" },
  { name: "Data Table", path: "/components/data-table" },
  { name: "Setting Item", path: "/components/setting-item" },
  { name: "Stat Card", path: "/components/stat-card" },
  { name: "Table", path: "/components/table" },
  { name: "Timeline", path: "/components/timeline" },
  { name: "Tree View", path: "/components/tree-view" },
];

export const formComponents: NavItem[] = [
  { name: "Checkbox", path: "/components/checkbox" },
  { name: "Combobox", path: "/components/combobox" },
  { name: "Dropzone", path: "/components/dropzone" },
  { name: "File Input", path: "/components/file-input" },
  { name: "Form Group", path: "/components/form-group" },
  { name: "Input", path: "/components/input" },
  { name: "Label", path: "/components/label" },
  { name: "Multi Select", path: "/components/multi-select" },
  { name: "Number Input", path: "/components/number-input" },
  { name: "Radio", path: "/components/radio" },
  { name: "Range", path: "/components/range" },
  { name: "Search Input", path: "/components/search-input" },
  { name: "Select", path: "/components/select" },
  { name: "Textarea", path: "/components/textarea" },
  { name: "Toggle", path: "/components/toggle" },
  { name: "Transfer List", path: "/components/transfer-list" },
];

export const feedbackComponents: NavItem[] = [
  { name: "Alert", path: "/components/alert" },
  { name: "Empty State", path: "/components/empty-state" },
  { name: "Progress", path: "/components/progress" },
  { name: "Skeleton", path: "/components/skeleton" },
  { name: "Spinner", path: "/components/spinner" },
  { name: "Toast", path: "/components/toast" },
];

export const overlayComponents: NavItem[] = [
  { name: "Alert Dialog", path: "/components/alert-dialog" },
  { name: "Dialog", path: "/components/dialog" },
  { name: "Drawer", path: "/components/drawer" },
  { name: "Dropdown Menu", path: "/components/dropdown" },
  { name: "Hover Card", path: "/components/hover-card" },
  { name: "Popover", path: "/components/popover" },
  { name: "Tooltip", path: "/components/tooltip" },
];

export const examplePages: NavItem[] = [
  { name: "Dashboard V1", path: "/examples/dashboard" },
  { name: "Dashboard V2", path: "/examples/dashboard-v2" },
  { name: "Dashboard V3", path: "/examples/dashboard-v3" },
  { name: "Dashboard V4", path: "/examples/dashboard-v4" },
  { name: "Dashboard V5", path: "/examples/dashboard-v5" },
];

/** All component groups in sidebar display order */
export const componentGroups = [
  { key: "layouts" as const, items: layoutComponents },
  { key: "basic" as const, items: basicComponents },
  { key: "typography" as const, items: typographyComponents },
  { key: "navigation" as const, items: navigationComponents },
  { key: "dataDisplay" as const, items: dataDisplayComponents },
  { key: "forms" as const, items: formComponents },
  { key: "feedback" as const, items: feedbackComponents },
  { key: "overlay" as const, items: overlayComponents },
];

/** Flat ordered list of all component pages (for prev/next navigation) */
export const allComponentPages: NavItem[] = componentGroups.flatMap(
  (g) => g.items
);
