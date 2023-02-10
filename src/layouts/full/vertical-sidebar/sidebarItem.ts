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
  { header: "Main" },
  {
    title: "Dashboard",
    icon: "pie-chart",
    to: "/dashboards/analytical",
  },
  {
    title: "Withdrawals",
    icon: "credit-card",
    to: "/withdrawals/all",
  },
 

  {
    title: "Giftcard Transactions ",
    icon: "gift",
    to: "/giftcards/transaction",
  },
  // {
  //   title: "Giftcard Management",
  //   icon: "users",
  //   to: "/giftcards/management",
   
  // },
  // { header: "Crypto" },
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
  // {
  //   title: "Crypto Management",
  //   icon: "disc",
  //   to: "/form-layouts/flformbasic",

  //   children: [
  //     {
  //       title: "Network Transaction",
  //       icon: "trending-up",
  //       to: "/form-elements/feautocompletes",
  //     },
  //     {
  //       title: "Asset Management",
  //       icon: "layout",
  //       to: "/form-elements/fecombobox",
  //     },
  //   ],
  // },
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
  { header: "Users" },
  {
    title: "Users",
    icon: "copy",
    to: "/user/all",
  },
  // { header: "Admin Management" },
  {
    title: "Admin",
    icon: "users",
    to: "/tables",
  },
  {
    title: "Roles & Permissions",
    icon: "user-plus",
    to: "/create-admin",
  },

  { header: "Notifications" },
  {
    title: "Announcements",
    icon: "bell",
    to: "/create-notification",
  },
  {
    title: "Notifications",
    icon: "user-plus",
    to: "/create-notification",
  },

  { header: "Settings" },
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
