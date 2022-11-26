import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Dashboard from "@/components/Dashboard.vue";
import Home from "@/components/Home.vue";
import KnivesStaking from "@/components/KnivesStaking.vue";
import Raffle from "@/components/Raffle.vue";
import Tickets from "@/components/Tickets.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    children: [
      {
        path: "/dashboard/knives/staking",
        name: "KnivesStaking",
        component: KnivesStaking,
      },
      {
        path: "/dashboard/knives/raffle",
        name: "Raffle",
        component: Raffle,
      },
      {
        path: "/dashboard/knives/tickets",
        name: "Tickets",
        component: Tickets,
      },
    ],
  },
  { path: "*", component: Home },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
