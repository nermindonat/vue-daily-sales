import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/auth/login/LoginView.vue";
import DailySalesChart from "@/views/dailySales/DailySalesChart.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/daily-sales",
    name: "DailySales",
    component: DailySalesChart,
  },
  {
    path: "/",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !localStorage.getItem("token"))
    next({ name: "Login" });
  else next();
});

export default router;
