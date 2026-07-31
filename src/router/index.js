import { createRouter, createWebHistory } from "vue-router";
import SpreadingAsumView from "@/views/asum/ImportSpreadingAsum.vue";

const routes = [
  // Redirect base path to default (Premi)
  {
    path: "/spread-asum",
    redirect: "/spread-asum/premi",
  },
  // Parameterized route for Premi / Klaim / Subrograsi
  {
    path: "/spread-asum/:mode",
    name: "spread-asum",
    component: SpreadingAsumView,
    meta: { isPublic: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;