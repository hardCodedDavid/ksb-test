export interface menu {
  header?: string;
  group?: string;
  model?: boolean;
  title?: any;
  icon?: string;
  to?: any;
  children?: menu[];
}

const sidebarItem: menu[] = [
  { header: "Home" },
  {
    title: "Dashboard",
    icon: "pie-chart",
    to: "/dashboards/analytical",
  },
  // {
  //   title: "eCommerce",
  //   icon: "shopping-bag",
  //   to: "/dashboards/ecommerce",
  // },
  // {
  //   title: "Modern",
  //   icon: "hard-drive",
  //   to: "/dashboards/modern",
  // },
  {
    header: "Transactions",
  },
  {
    title: "Withdrawals",
    icon: "credit-card",
    to: "/apps/chat",
  },
  // {
  //   title: "Calendar",
  //   icon: "calendar",
  //   to: "/apps/fullcalendar",
  // },
  // {
  //   title: "Ecommerce-Shop",
  //   icon: "shopping-cart",
  //   to: "/apps/shop",
  // },

  // {
  //   title: "Contact List",
  //   icon: "phone",
  //   to: "/apps/contact-list",
  // },
  // {
  //   title: "Contact Grid",
  //   icon: "smartphone",
  //   to: "/apps/contact-grid",
  // },

  // {
  //   title: "Todo",
  //   icon: "check-square",
  //   to: "/apps/todo",
  // },
  // { header: "Components" },
  // {
  //   group: "/ui-components/",

  //   model: false,
  //   icon: "grid",
  //   title: "Ui Components",
  //   children: [
  //     {
  //       title: "Alerts",
  //       icon: "disc",
  //       to: "/ui-components/alert",
  //     },
  //     {
  //       title: "Avatar",
  //       icon: "disc",
  //       to: "/ui-components/avatar",
  //     },
  //     {
  //       title: "Badge",
  //       icon: "disc",
  //       to: "/ui-components/badge",
  //     },
  //     {
  //       title: "Banner",
  //       icon: "disc",
  //       to: "/ui-components/banner",
  //     },
  //     {
  //       title: "Appbar",
  //       icon: "disc",
  //       to: "/ui-components/appbar",
  //     },
  //     {
  //       title: "Toolbar",
  //       icon: "disc",
  //       to: "/ui-components/toolbar",
  //     },
  //     {
  //       title: "Systembar",
  //       icon: "disc",
  //       to: "/ui-components/systembar",
  //     },
  //     {
  //       title: "Breadcrumb",
  //       icon: "disc",
  //       to: "/ui-components/breadcrumb",
  //     },
  //     {
  //       title: "Buttons",
  //       icon: "disc",
  //       to: "/ui-components/buttons",
  //     },
  //     {
  //       title: "Cards",
  //       icon: "disc",
  //       to: "/ui-components/cards",
  //     },
  //     {
  //       title: "Carousel",
  //       icon: "disc",
  //       to: "/ui-components/carousel",
  //     },
  //     {
  //       title: "Chips",
  //       icon: "disc",
  //       to: "/ui-components/chips",
  //     },
  //     {
  //       title: "Dialogs",
  //       icon: "disc",
  //       to: "/ui-components/dialogs",
  //     },
  //     {
  //       title: "Dividers",
  //       icon: "disc",
  //       to: "/ui-components/dividers",
  //     },
  //     {
  //       title: "Expansion Panel",
  //       icon: "disc",
  //       to: "/ui-components/expansionpanel",
  //     },
  //     {
  //       title: "Footer",
  //       icon: "disc",
  //       to: "/ui-components/footer",
  //     },
  //     {
  //       title: "Grids",
  //       icon: "disc",
  //       to: "/ui-components/grids",
  //     },
  //     {
  //       title: "Button Group",
  //       icon: "disc",
  //       to: "/ui-components/button-group",
  //     },
  //     {
  //       title: "Chip Group",
  //       icon: "disc",
  //       to: "/ui-components/chip-group",
  //     },
  //     {
  //       title: "Item Group",
  //       icon: "disc",
  //       to: "/ui-components/item-group",
  //     },
  //     {
  //       title: "Slide Group",
  //       icon: "disc",
  //       to: "/ui-components/slide-group",
  //     },
  //     {
  //       title: "Images",
  //       icon: "disc",
  //       to: "/ui-components/images",
  //     },
  //     {
  //       title: "Menus",
  //       icon: "disc",
  //       to: "/ui-components/menus",
  //     },
  //     {
  //       title: "Navigation Drawers",
  //       icon: "disc",
  //       to: "/ui-components/navigation-drawers",
  //     },
  //     {
  //       title: "Pagination",
  //       icon: "disc",
  //       to: "/ui-components/pagination",
  //     },
  //     {
  //       title: "Progress Circular",
  //       icon: "disc",
  //       to: "/ui-components/progress-circular",
  //     },
  //     {
  //       title: "Progress Linear",
  //       icon: "disc",
  //       to: "/ui-components/progress-linear",
  //     },
  //     {
  //       title: "Rating",
  //       icon: "disc",
  //       to: "/ui-components/rating",
  //     },
  //     {
  //       title: "Tabs",
  //       icon: "disc",
  //       to: "/ui-components/tabs",
  //     },
  //     {
  //       title: "Timeline",
  //       icon: "disc",
  //       to: "/ui-components/timeline",
  //     },
  //     {
  //       title: "Tooltips",
  //       icon: "disc",
  //       to: "/ui-components/tooltips",
  //     },
  //   ],
  // },
  // {
  //   group: "/style-animation",
  //   model: false,
  //   icon: "box",
  //   title: "Style & Animation",
  //   children: [
  //     {
  //       title: "Border Radius",
  //       icon: "disc",
  //       to: "/style-animation/border-radius",
  //     },
  //     {
  //       title: "Elevation",
  //       icon: "disc",
  //       to: "/style-animation/elevation",
  //     },
  //     {
  //       title: "Flex",
  //       icon: "disc",
  //       to: "/style-animation/flex",
  //     },
  //     {
  //       title: "Text and Typography",
  //       icon: "disc",
  //       to: "/style-animation/text-typography",
  //     },
  //     {
  //       title: "Transitions",
  //       icon: "disc",
  //       to: "/style-animation/transitions",
  //     },
  //   ],
  // },
  { header: "Gift Cards" },
  {
    title: "Giftcard Transactions ",
    icon: "gift",
    to: "/charts/apexcharts",
  },
  {
    title: "Giftcard Management",
    icon: "users",
    to: "/charts/apexcharts",
  },
  { header: "Crypto" },
  // {
  //   group: "/form-elements",
  //   model: false,
  //   icon: "file",
  //   title: "Form Elements",
  //   children: [
  //     {
  //       title: "Autocompletes",
  //       icon: "disc",
  //       to: "/form-elements/feautocompletes",
  //     },
  //     {
  //       title: "Combobox",
  //       icon: "disc",
  //       to: "/form-elements/fecombobox",
  //     },
  //     {
  //       title: "File Inputs",
  //       icon: "disc",
  //       to: "/form-elements/fefileinputs",
  //     },
  //     {
  //       title: "Inputs",
  //       icon: "disc",
  //       to: "/form-elements/feinputs",
  //     },

  //     {
  //       title: "Selection Controls",
  //       icon: "disc",
  //       to: "/form-elements/feselectioncontrols",
  //     },
  //     {
  //       title: "Selects",
  //       icon: "disc",
  //       to: "/form-elements/feselects",
  //     },
  //     {
  //       title: "Sliders",
  //       icon: "disc",
  //       to: "/form-elements/fesliders",
  //     },
  //     {
  //       title: "Textareas",
  //       icon: "disc",
  //       to: "/form-elements/fetextareas",
  //     },
  //     {
  //       title: "Textfields",
  //       icon: "disc",
  //       to: "/form-elements/fetextfields",
  //     },
  //   ],
  // },
  {
    title: "Crypto Transaction",
    icon: "trending-down",
    to: "/form-layouts/flformaction",
  },
  {
    title: "Crypto Management",
    icon: "disc",
    to: "/form-layouts/flformbasic",

    children: [
      {
        title: "Network Transaction",
        icon: "trending-up",
        to: "/form-elements/feautocompletes",
      },
      {
        title: "Asset Management",
        icon: "layout",
        to: "/form-elements/fecombobox",
      },
    ],
  },
  // {
  //   group: "/form-layouts",
  //   model: false,
  //   icon: "codesandbox",
  //   title: "Form Layouts",
  //   children: [
  //     {
  //       title: "Form Action",
  //       icon: "disc",
  //       to: "/form-layouts/flformaction",
  //     },
  //     {
  //       title: "Form Basic",
  //       icon: "disc",
  //       to: "/form-layouts/flformbasic",
  //     },

  //     {
  //       title: "Form Horizontal",
  //       icon: "disc",
  //       to: "/form-layouts/flformhorizontal",
  //     },
  //   ],
  // },
  { header: "User Management" },
  {
    title: "All Users",
    icon: "copy",
    to: "/widgets/custom-cards",
  },
  { header: "Admin Management" },
  {
    title: "All admin",
    icon: "users",
    to: "/tables",
  },
  {
    title: "Create Admin",
    icon: "user-plus",
    to: "/create-admin",
  },
  { header: "Roles Management" },
  {
    title: "All Roles",
    icon: "users",
    to: "/tables",
  },
  {
    title: "Create Roles",
    icon: "user-plus",
    to: "/create-role",
  },
  { header: "Notifications Management" },
  {
    title: "All Notification",
    icon: "bell",
    to: "/create-notification",
  },
  {
    title: "Create Notification",
    icon: "user-plus",
    to: "/create-notification",
  },
  // { header: "Authentication" },
  // {
  //   title: "Boxed Login",
  //   icon: "log-in",
  //   to: "/authentication/boxedlogin",
  // },
  // {
  //   title: "Login",
  //   icon: "unlock",
  //   to: "/authentication/fulllogin",
  // },
  // {
  //   title: "Boxed Register",
  //   icon: "user-plus",
  //   to: "/authentication/boxedregister",
  // },
  // {
  //   title: "Register",
  //   icon: "user",
  //   to: "/authentication/fullregister",
  // },
  // {
  //   title: "Error",
  //   icon: "alert-triangle",
  //   to: "/authentication/error",
  // },
  // { header: "Icons" },
  // {
  //   title: "Material",
  //   icon: "codesandbox",
  //   to: "/icons/material",
  // },
  // {
  //   title: "Feather",
  //   icon: "feather",
  //   to: "/icons/feather",
  // },
];

export default sidebarItem;
