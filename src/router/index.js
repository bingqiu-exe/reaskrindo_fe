import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ImportAutoMapping from "../views/auto_mapping/ImportAutoMapping.vue";
import ImportSpreadingAsum from "../views/asum/ImportSpreadingAsum.vue";
import ImportSpreadingFinance from "../views/finansial/ImportSpreadingFinance.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { isPublic: true },
  },
  {
    path: "/auto-mapping/",
    name: "auto-mapping",
    component: ImportAutoMapping,
    meta: { isPublic: true },
  },
  {
    path: "/spread-asum/",
    name: "spread-asum",
    component: ImportSpreadingAsum,
    meta: { isPublic: true },
  },
  {
    path: "/spread-finance/",
    name: "spread-finance",
    component: ImportSpreadingFinance,
    meta: { isPublic: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;