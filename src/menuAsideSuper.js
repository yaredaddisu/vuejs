import {
  mdiAccountCircle,
  mdiMonitor,
  mdiPalette,
  mdiAccountMultiplePlus,
  mdiCameraImage,
  mdiAccountPlus,
  mdiShapePlus,
  mdiChartBarStacked,
  mdiStoreMarkerOutline,
  mdiArrowCollapseDown,
  mdiArrowExpandUp,
  mdiHistory,
  mdiCartPercent,
  mdiGraph,
  mdiAccountGroup,
  mdiCartArrowDown,
  mdiHome,
  mdiSale,
} from "@mdi/js";
import store from "@/store";
import { computed, ref, watch, onMounted } from "vue";

export default [
  {
    to: "/dashboard",
    icon: mdiMonitor,
    label: "Dashboard",
  },
  {
    to: "/warehouses",
    label: " Warehouse",
    icon: mdiHome,
  },

  {
    to: "/users",
    label: "Users",
    icon: mdiAccountMultiplePlus,
  },

  {
    to: "/category",
    label: "Categories  ",
    icon: mdiShapePlus,
  },
  {
    to: "/product-list",
    label: "Product List",
    icon: mdiStoreMarkerOutline,
  },
  {
    to: "/stock-in",
    label: "Stock In",
    icon: mdiArrowCollapseDown,
  },
  {
    to: "/stock-out",
    label: "Stock Out",
    icon: mdiArrowExpandUp,
  },
  {
    label: "Transactions",
    icon: mdiSale,
    menu: [
      {
        to: "/history-stock-in",
        label: "  Stock In",
        icon: mdiHistory,
      },
      {
        to: "/history-stock-out",
        label: "  Stock Out",
        icon: mdiHistory,
      },
    ],
  },
  {
    to: "/purchase",
    label: " Purchase",
    icon: mdiCartArrowDown,
  },
  {
    to: "/members",
    label: " Partner",
    icon: mdiAccountGroup,
  },
  {
    label: "Reports",
    icon: mdiChartBarStacked,
    menu: [
      {
        to: "/order-details",
        label: "SalesReport",
        icon: mdiCartPercent,
      },
      {
        to: "/reports",
        label: "Dashboard",
        icon: mdiMonitor,
      },
      {
        to: "/chart",
        label: "Chart",
        icon: mdiGraph,
      },
    ],
  },

  ///

  ///

  {
    label: "Logos",
    icon: mdiCameraImage,
    menu: [
      {
        to: "/logos",
        label: "Logos",
        icon: mdiCameraImage,
      },
      {
        to: "/logos/create",
        label: "Create Logo",
        icon: mdiCameraImage,
      },
    ],
  },

  {
    to: "/",
    label: "Styles",
    icon: mdiPalette,
  },
  {
    to: "/profile/:id",
    label: "Profile",
    icon: mdiAccountCircle,
  },
];
