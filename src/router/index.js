import { createRouter, createWebHistory } from "vue-router";
import ImportAutoMapping from "../views/auto_mapping/ImportAutoMapping.vue";
import ImportSpreadingAsum from "../views/asum/ImportSpreadingAsum.vue";
import ImportSpreadingFinance from "../views/finansial/ImportSpreadingFinance.vue";
import ImportSpreadingKP from "../views/kp/ImportSpreadingKP.vue";

const routes = [
  {
    path: "/auto-mapping/",
    name: "auto-mapping",
    component: ImportAutoMapping,
    meta: { isPublic: true },
  },
  {
    path: "/spread-asum/:mode",
    name: "spread-asum",
    component: ImportSpreadingAsum,
    meta: { isPublic: true },
  },
  {
    path: "/spread-finance/:mode",
    name: "spread-finance",
    component: ImportSpreadingFinance,
    meta: { isPublic: true },
  },
  {
    path: "/spread-kp/:mode",
    name: "spread-kp",
    component: ImportSpreadingKP,
    meta: { isPublic: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;