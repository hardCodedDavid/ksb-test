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
 
  { header: "Gift Cards" },
  {
    title: "Giftcard Transactions ",
    icon: "gift",
    to: "/giftcards/transaction",
  },
  {
    title: "Giftcard Management",
    icon: "users",
    to: "/giftcards/management",
   
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
