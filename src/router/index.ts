import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '../stores/auth'

const router = createRouter({

  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      redirect: "/dashboards/analytical",
      component: () => import("@/layouts/full/FullLayout.vue"),
      children: [
        {
          name: "Analytical",
          path: "/dashboards/analytical",
          component: () =>
            import("@/views/dashboards/analytical/Analytical.vue"),
        },
        {
          name: "Profile",
          path: "/user/profile",
          component: () => import("@/views/profile.vue"),
        },
        {
          name: "Modern",
          path: "/dashboards/modern",
          component: () => import("@/views/dashboards/modern/Modern.vue"),
        },
        {
          name: "Apps",
          path: "/withdrawals/all",
          component: () => import("@/views/withdrawals/all.vue"),
        },
        {
          name: "viewWithdrawals",
          path: "/withdrawals/:id",
          component: () => import("@/views/withdrawals/view-withdrawals/Index.vue"),
        },
        // {
        //   name: "ContactList",
        //   path: "apps/contact-list",
        //   component: () => import("@/views/apps/contact-list/ContactList.vue"),
        // },
        // {
        //   name: "ContactGrid",
        //   path: "apps/contact-grid",
        //   component: () => import("@/views/apps/contact-grid/ContactGrid.vue"),
        // },
        // {
        //   name: "Ecommerce-shop",
        //   path: "apps/shop",
        //   component: () => import("@/views/apps/ecommerce/Listing.vue"),
        // },
        // {
        //   name: "Calendar",
        //   path: "apps/fullcalendar",
        //   component: () => import("@/views/apps/calendar/VCalendar.vue"),
        // },
        // {
        //   name: "Todo",
        //   path: "apps/todo",
        //   component: () => import("@/views/apps/todo/Todo.vue"),
        // },
        {
          name: "AssetsTransaction",
          path: "/asset/transaction",
          component: () => import("@/views/asset/all-transactions.vue"),
        },
        {
          name: "ViewAssetsTransaction",
          path: "/asset/transaction/:id",
          component: () => import("@/views/asset/transaction-view.vue"),
          props:true
        },
        {
          name: "GiftCardTransaction",
          path: "/giftcards/transaction",
          component: () => import("@/views/giftcards/transaction.vue"),
        },
        {
          name: "ViewGiftCardTransaction",
          path: "/giftcards/transaction/:id",
          component: () => import("@/views/giftcards/view-transaction/Index.vue"),
        },
        {
          name: "GiftCardCategory",
          path: "/giftcards/categories",
          component: () => import("@/views/giftcards/category.vue"),
        },
        {
          name: "GiftCardProducts",
          path: "/giftcards/products",
          component: () => import("@/views/giftcards/products.vue"),
        },
        {
          name: "Alert",
          path: "ui-components/alert",
          component: () => import("@/views/ui-components/Alerts.vue"),
        },
        {
          name: "Avatar",
          path: "ui-components/avatar",
          component: () => import("@/views/ui-components/Avatar.vue"),
        },
        {
          name: "Badge",
          path: "/ui-components/badge",
          component: () => import("@/views/ui-components/Badge.vue"),
        },
        {
          name: "Banner",
          path: "/ui-components/banner",
          component: () => import("@/views/ui-components/Banner.vue"),
        },
        {
          name: "Banner",
          path: "/ui-components/banner",
          component: () => import("@/views/ui-components/Banner.vue"),
        },

        {
          name: "Appbar",
          path: "/ui-components/appbar",
          component: () => import("@/views/ui-components/Appbar.vue"),
        },
        {
          name: "Toolbar",
          path: "/ui-components/toolbar",
          component: () => import("@/views/ui-components/Toolbar.vue"),
        },
        {
          name: "Systembar",
          path: "/ui-components/systembar",
          component: () => import("@/views/ui-components/Systembar.vue"),
        },
        {
          name: "Breadcrumb",
          path: "/ui-components/breadcrumb",
          component: () => import("@/views/ui-components/Breadcrumb.vue"),
        },
        {
          name: "Buttons",
          path: "/ui-components/buttons",
          component: () => import("@/views/ui-components/Buttons.vue"),
        },
        {
          name: "Cards",
          path: "/ui-components/cards",
          component: () => import("@/views/ui-components/Cards.vue"),
        },
        {
          name: "Carousel",
          path: "/ui-components/carousel",
          component: () => import("@/views/ui-components/Carousel.vue"),
        },
        {
          name: "Chips",
          path: "/ui-components/chips",
          component: () => import("@/views/ui-components/Chips.vue"),
        },
        {
          name: "Dialogs",
          path: "/ui-components/dialogs",
          component: () => import("@/views/ui-components/Dialogs.vue"),
        },
        {
          name: "Dividers",
          path: "/ui-components/dividers",
          component: () => import("@/views/ui-components/Dividers.vue"),
        },
        {
          name: "Expansion Panel",
          path: "/ui-components/expansionpanel",
          component: () => import("@/views/ui-components/ExpansionPanel.vue"),
        },
        {
          name: "Footer",
          path: "/ui-components/footer",
          component: () => import("@/views/ui-components/Footer.vue"),
        },
        {
          name: "Grids",
          path: "/ui-components/grids",
          component: () => import("@/views/ui-components/Grids.vue"),
        },
        {
          name: "Button Groups",
          path: "/ui-components/button-group",
          component: () => import("@/views/ui-components/ButtonGroups.vue"),
        },
        {
          name: "Chip Groups",
          path: "/ui-components/chip-group",
          component: () => import("@/views/ui-components/ChipGroups.vue"),
        },
        {
          name: "Item Groups",
          path: "/ui-components/item-group",
          component: () => import("@/views/ui-components/ItemGroups.vue"),
        },
        {
          name: "Slide Groups",
          path: "/ui-components/slide-group",
          component: () => import("@/views/ui-components/SlideGroups.vue"),
        },
        {
          name: "Images",
          path: "/ui-components/images",
          component: () => import("@/views/ui-components/Images.vue"),
        },
        {
          name: "Menus",
          path: "/ui-components/menus",
          component: () => import("@/views/ui-components/Menus.vue"),
        },
        {
          name: "Navigation Drawers",
          path: "/ui-components/navigation-drawers",
          component: () =>
            import("@/views/ui-components/NavigationDrawers.vue"),
        },
        {
          name: "Pagination",
          path: "/ui-components/pagination",
          component: () => import("@/views/ui-components/Pagination.vue"),
        },
        {
          name: "Progress Circular",
          path: "/ui-components/progress-circular",
          component: () => import("@/views/ui-components/ProgressCircular.vue"),
        },
        {
          name: "Progress Linear",
          path: "/ui-components/progress-linear",
          component: () => import("@/views/ui-components/ProgressLinear.vue"),
        },
        {
          name: "Rating",
          path: "/ui-components/rating",
          component: () => import("@/views/ui-components/Rating.vue"),
        },
        {
          name: "Tabs",
          path: "/ui-components/tabs",
          component: () => import("@/views/ui-components/Tabs.vue"),
        },
        {
          name: "Timeline",
          path: "/ui-components/timeline",
          component: () => import("@/views/ui-components/Timeline.vue"),
        },
        {
          name: "Tooltips",
          path: "/ui-components/tooltips",
          component: () => import("@/views/ui-components/Tooltips.vue"),
        },
        {
          name: "Border Radius",
          path: "/style-animation/border-radius",
          component: () => import("@/views/style-animation/BorderRadius.vue"),
        },
        {
          name: "Elevation",
          path: "/style-animation/elevation",
          component: () => import("@/views/style-animation/Elevation.vue"),
        },
        {
          name: "Flex",
          path: "/style-animation/flex",
          component: () => import("@/views/style-animation/Flex.vue"),
        },
        {
          name: "Text Typography",
          path: "/style-animation/text-typography",
          component: () => import("@/views/style-animation/TextTypography.vue"),
        },
        {
          name: "Transitions",
          path: "/style-animation/transitions",
          component: () => import("@/views/style-animation/Transition.vue"),
        },
        {
          name: "FEAutocompletes",
          path: "/form-elements/FEautocompletes",
          component: () => import("@/views/form-elements/FEAutocompletes.vue"),
        },
        {
          name: "FECombobox",
          path: "/form-elements/FECombobox",
          component: () => import("@/views/form-elements/FECombobox.vue"),
        },
        {
          name: "FEFileInputs",
          path: "/form-elements/FEFileInputs",
          component: () => import("@/views/form-elements/FEFileInputs.vue"),
        },
        {
          name: "FEInputs",
          path: "/form-elements/FEInputs",
          component: () => import("@/views/form-elements/FEInputs.vue"),
        },
        {
          name: "FESelectionControls",
          path: "/form-elements/FESelectionControls",
          component: () =>
            import("@/views/form-elements/FESelectionControls.vue"),
        },
        {
          name: "FESelects",
          path: "/form-elements/FESelects",
          component: () => import("@/views/form-elements/FESelects.vue"),
        },
        {
          name: "FESliders",
          path: "/form-elements/FESliders",
          component: () => import("@/views/form-elements/FESliders.vue"),
        },
        {
          name: "FETextareas",
          path: "/form-elements/FETextareas",
          component: () => import("@/views/form-elements/FETextareas.vue"),
        },
        {
          name: "FETextfields",
          path: "/form-elements/FETextfields",
          component: () => import("@/views/form-elements/FETextfields.vue"),
        },
        {
          name: "FLFormAction",
          path: "/form-layouts/FLFormAction",
          component: () =>
            import("@/views/form-layouts/form-action/FLFormAction.vue"),
        },
        {
          name: "FLFormBasic",
          path: "/form-layouts/FLFormBasic",
          component: () =>
            import("@/views/form-layouts/form-basic/FLFormBasic.vue"),
        },
        {
          name: "FLFormHorizontal",
          path: "/form-layouts/FLFormHorizontal",
          component: () =>
            import("@/views/form-layouts/form-horizontal/FLFormHorizontal.vue"),
        },

        {
          name: "Admin",
          path: "/admin",
          component: () => import("@/views/admin/index.vue"),
        },
        {
          name: "Editable Table",
          path: "/editable-table",
          component: () => import("@/views/tables/EditableTable.vue"),
        },
        {
          name: "Material",
          path: "/icons/material",
          component: () => import("@/views/icons/MaterialIcons.vue"),
        },
        {
          name: "Feather",
          path: "/icons/feather",
          component: () => import("@/views/icons/FeatherIcons.vue"),
        },
        {
          name: "Notifications",
          path: "/notifications/all",
          component: () =>
            import("@/views/all-notifications.vue"),
        },
        {
          name: "Announcements",
          path: "/announcements",
          component: () =>
            import("@/views/annoucements.vue"),
        },
        {
          name: "RolesandPermissions",
          path: "/roles",
          component: () =>
            import("@/views/roles/roles-permission.vue"),
        },
        {
          name: "Create Role",
          path: "/roles/create-role",
          component: () =>
            import("@/views/roles/create-role.vue"),
        },
        {
          name: "Users",
          path: "/user/all",
          component: () =>
            import("@/views/users.vue"),
        },
        {
          name: "UserDetails",
          path: "/user/:id",
          component: () =>
            import("@/views/user-details.vue"),
            props:true
        },
        {
          name: "Countries",
          path: "/countries/all",
          component: () =>
            import("@/views/country-management.vue"),
        },
        {
          name: "Currencies",
          path: "/currencies/all",
          component: () =>
            import("@/views/currency.vue"),
        },
        {
          name: "Assets",
          path: "/assets/all",
          component: () =>
            import("@/views/asset/assets.vue"),
        },
        {
          name: "Network",
          path: "/networks/all",
          component: () =>
            import("@/views/network.vue"),
        },
        {
          name: "System data",
          path: "/system-data",
          component: () =>
            import("@/views/system-data.vue"),
        },
      ],
    },
    {
      path: "/authentication",
      component: () => import("@/layouts/blank/BlankLayout.vue"),
      children: [
        {
          name: "Login",
          path: "/auth/login",
          component: () => import("@/views/authentication/FullLogin.vue"),

        },
        {
          name: "Two Fa",
          path: "/authentication/verify-two-fa",
          component: () => import("@/views/authentication/VerifiyTwoFa.vue"),
        },
        {
          name: "Error",
          path: "/authentication/error",
          component: () => import("@/views/authentication/Error.vue"),
        },
        {
          name: "ResetPassword",
          path: "/authentication/reset-password",
          component: () => import("@/views/authentication/reset-password/index.vue"),
        },
        {
          name: "ResetCode",
          path: "/authentication/request-reset-code",
          component: () => import("@/views/authentication/ResetCode.vue"),
        },
      ],
    },
  ],
});


router.beforeEach(async (to, from) => {
  const store  = useAuthStore()
  if (
    
    !store.isLoggedIn &&
   
    to.name !== 'Login'
  ) {
  
    return { name: 'Login' }
  }
})

export default router;
