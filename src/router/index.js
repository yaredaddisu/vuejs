import { createRouter, createWebHashHistory } from "vue-router";

import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue";
import store from "../store";
import AuthLayout from "../components/AuthLayout.vue";

const routes = [
  {
    meta: {
      title: "Select style",
    },
    path: "/",
    name: "style",
    component: Style,
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
    path: "/dashboard",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Members",
      requiresAuth: true,
    },
    path: "/members",
    name: "members",
    component: () => import("@/views/Members.vue"),
  },

  {
    meta: {
      title: "MemberView",
      requiresAuth: true,
    },
    path: "/members/create",
    name: "MemberCreate",
    component: () => import("@/views/MemberView.vue"),
  },
  {
    meta: {
      title: "EditMember",
      requiresAuth: true,
    },
    path: "/members/:id",
    name: "EditMember",
    component: () => import("@/views/EditMember.vue"),
  },
  /*members view End */

  {
    meta: {
      title: "label",
    },
    path: "/label",
    name: "label",
    component: () => import("@/views/BarCodeGen.vue"),
  },
  {
    meta: {
      title: "label-generator",
    },
    path: "/label-generator",
    name: "label-generator",
    component: () => import("@/views/LabelGen.vue"),
  },

  {
    meta: {
      title: "chart",
    },
    path: "/chart",
    name: "chart",
    component: () => import("@/views/Charts.vue"),
  },
  {
    meta: {
      title: "ResetSecret",
    },
    path: "/secretword/ResetSecret",
    name: "reset-secret",
    component: () => import("@/views/secretword/ResetSecret.vue"),
  },
  {
    meta: {
      title: "TokenSecret",
    },
    path: "/secretword/TokenSecret",
    name: "reset-token",
    component: () => import("@/views/secretword/TokenSecret.vue"),
  },

  {
    meta: {
      title: "Reports",
      requiresAuth: true,
    },
    path: "/reports",
    name: "reports",
    component: () => import("@/views/Reports.vue"),
  },

  {
    meta: {
      title: "Purchase",
      requiresAuth: true,
    },
    path: "/purchase",
    name: "purchase",
    component: () => import("@/views/Purchase.vue"),
  },

  {
    meta: {
      title: "PurchaseView",
      requiresAuth: true,
    },
    path: "/purchase/create",
    name: "PurchaseCreate",
    component: () => import("@/views/PurchaseView.vue"),
  },
  {
    meta: {
      title: "PurchaseEdit",
      requiresAuth: true,
    },
    path: "/purchase/:id",
    name: "PurchaseEdit",
    component: () => import("@/views/PurchaseEdit.vue"),
  },
  ////

  ///
  {
    meta: {
      title: "Test",
      requiresAuth: true,
    },
    path: "/test",
    name: "test",
    component: () => import("@/views/Test.vue"),
  },
  ///
  {
    meta: {
      title: "Category",
      requiresAuth: true,
    },
    path: "/category",
    name: "category",
    component: () => import("@/views/Category.vue"),
  },
  {
    meta: {
      title: "Category",
      requiresAuth: true,
    },
    path: "/category/create",
    name: "CategoryCreate",
    component: () => import("@/views/CategoryView.vue"),
  },
  {
    meta: {
      title: "Category",
      requiresAuth: true,
    },
    path: "/category/:id",
    name: "CategoryView",
    component: () => import("@/views/CategoryView.vue"),
  },
  ///
  {
    meta: {
      title: "UserReports",
      requiresAuth: true,
    },
    path: "/user-reports/:id",
    name: "UserReports",
    component: () => import("@/views/UserReports.vue"),
  },
  {
    meta: {
      title: "UserReports",
      requiresAuth: true,
    },
    path: "/user-reports/:id",
    name: "UserReportsView",
    component: () => import("@/views/UserReportsView.vue"),
  },

  {
    meta: {
      title: "UserBuyReports",
      requiresAuth: true,
    },
    path: "/user-buy-reports/:id",
    name: "UserBuyReports",
    component: () => import("@/views/UserBuyReports.vue"),
  },
  {
    meta: {
      title: "PurchaseReports",
      requiresAuth: true,
    },
    path: "/user-purchase-reports/:id",
    name: "PurchaseReports",
    component: () => import("@/views/PurchaseReports.vue"),
  },
  {
    meta: {
      title: "WhereHouse",
      requiresAuth: true,
    },
    path: "/warehouses",
    name: "warehouses",
    component: () => import("@/views/Warehouse.vue"),
  },
  {
    meta: {
      title: "Warehouse",
      requiresAuth: true,
    },
    path: "/warehouses/create",
    name: "WarehouseCreate",
    component: () => import("@/views/WareHouseView.vue"),
  },
  {
    meta: {
      title: "Warehouse",
      requiresAuth: true,
    },
    path: "/warehouses/:id",
    name: "WareHouseView",
    component: () => import("@/views/WareHouseView.vue"),
  },
  ///
  {
    meta: {
      title: "SuccessMessage",
      requiresAuth: false,
    },
    path: "/success_message",
    name: "SuccessMessage",
    component: () => import("@/views/SuccessMessage.vue"),
  },

  ///
  {
    meta: {
      title: "User",
      requiresAuth: true,
    },
    path: "/users",
    name: "users",
    component: () => import("@/views/User.vue"),
  },
  {
    meta: {
      title: "UserView",
      requiresAuth: true,
    },
    path: "/users/create",
    name: "UserCreate",
    component: () => import("@/views/UserView.vue"),
  },
  {
    meta: {
      title: "UserView",
      requiresAuth: true,
    },
    path: "/users/:id",
    name: "UserView",
    component: () => import("@/views/UserView.vue"),
  },

  ///

  {
    meta: {
      title: "Logos",
      requiresAuth: true,
    },
    path: "/logos",
    name: "logos",
    component: () => import("@/views/Logos.vue"),
  },
  {
    meta: {
      title: "LogoView",
      requiresAuth: true,
    },
    path: "/logos/create",
    name: "LogoCreate",
    component: () => import("@/views/LogoView.vue"),
  },
  ///
  {
    meta: {
      title: "mergeReports",
      requiresAuth: true,
    },
    path: "/merge-reports/:id",
    name: "mergeReports",
    component: () => import("@/views/mergeReports.vue"),
  },
  {
    meta: {
      title: "Stock In",
      requiresAuth: true,
    },
    path: "/stock-in",
    name: "stock-in",
    component: () => import("@/views/StockIn.vue"),
  },
  {
    meta: {
      title: "Stock Out",
      requiresAuth: true,
    },
    path: "/stock-out",
    name: "stock-out",
    component: () => import("@/views/StockOut.vue"),
  },
  {
    meta: {
      title: "LogoView",
      requiresAuth: true,
    },
    path: "/logos/create",
    name: "LogoCreate",
    component: () => import("@/views/LogoView.vue"),
  },

  ///
  {
    meta: {
      title: "LogoView",
      requiresAuth: true,
    },
    path: "/logos/:id",
    name: "LogoView",
    component: () => import("@/views/LogoView.vue"),
  },
  ///
  {
    meta: {
      title: "UserDetail",
      requiresAuth: true,
    },
    path: "/users-detail/:id",
    name: "UserDetail",
    component: () => import("@/views/UserDetail.vue"),
  },

  {
    meta: {
      title: "PurchaseSlug",
      requiresAuth: false,
    },

    path: "/purchase/view/:id",
    name: "PurchaseSlug",
    component: () => import("@/views/PurchaseSlug.vue"),
  },

  {
    meta: {
      title: "HistoryStockIn",
      requiresAuth: true,
    },
    path: "/history-stock-in",
    name: "HistoryStockIn",
    component: () => import("@/views/HistoryStockIn.vue"),
  },

  {
    meta: {
      title: "History",
      requiresAuth: true,
    },
    path: "/history-stock-out",
    name: "history",
    component: () => import("@/views/History.vue"),
  },

  ///
  {
    meta: {
      title: "Product List",
      requiresAuth: true,
    },
    path: "/product-list",
    name: "product-list",
    component: () => import("@/views/ProductList.vue"),
  },

  {
    meta: {
      title: "ProductListView",
      requiresAuth: true,
    },
    path: "/product-list/create",
    name: "ProductCreate",
    component: () => import("@/views/ProductListView.vue"),
  },

  {
    meta: {
      title: "ProductListView",
      requiresAuth: true,
    },
    path: "/product-list/:id",
    name: "ProductListView",
    component: () => import("@/views/ProductListView.vue"),
  },

  ///

  ///
  {
    meta: {
      title: "Order Details",
      requiresAuth: true,
    },
    path: "/order-details",
    name: "order-details",
    component: () => import("@/views/OrderDetails.vue"),
  },

  {
    meta: {
      title: "OrderDetails",
      requiresAuth: true,
    },
    path: "/order-details/:id",
    name: "OrderDetails",
    component: () => import("@/views/OrderDetails.vue"),
  },

  ///
  {
    meta: {
      title: "SellProduct",
      requiresAuth: true,
    },
    path: "/sell-product/:id",
    name: "SellProduct",
    component: () => import("@/views/SellProduct.vue"),
  },

  {
    meta: {
      title: "ProductListView",
      requiresAuth: true,
    },

    path: "/products/:id",
    name: "ProductListView",
    component: () => import("@/views/ProductListView.vue"),
  },
  //

  ////

  {
    meta: {
      title: "Profile",
    },
    path: "/profile/:id",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "sales-detail",
    },
    path: "/sales-detail/:id",
    name: "sales-detail",
    component: () => import("@/components/ShowOrderModel.vue"),
  },

  {
    path: "/auth",
    redirect: "/login",
    name: "auth",
    component: AuthLayout,
    meta: { isGuest: true },
    children: [
      {
        meta: {
          title: "Login",
        },
        path: "/login",
        name: "login",
        component: () => import("@/views/Login.vue"),
      },
      {
        meta: {
          title: "Register",
        },
        path: "/register",
        name: "register",
        component: () => import("@/views/Register.vue"),
      },
      {
        meta: {
          title: "Reset",
        },
        path: "/password/reset",
        name: "reset",
        component: () => import("@/views/password/Reset.vue"),
      },
      {
        meta: {
          title: "Token",
        },
        path: "/password/token",
        name: "token",
        component: () => import("@/views/password/Token.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user.token) {
    next({ name: "login" });
  } else if (store.state.user.token && to.meta.isGuest) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});
export default router;
