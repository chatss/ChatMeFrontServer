import index from "../pages/index";
import Chat from "../pages/Chat";
import Room2 from "../pages/Room2";
import register from "../pages/register";
import Error404 from "../pages/Error404";
const routes = [
  {
    path: "/",
    component: index
    // children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  {
    path: "/chat",
    component: Chat
    // children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  {
    path: "/register",
    component: register
    // children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  {
    path: "/room",
    component: Room2
    // children: [{ path: "", component: () => import("pages/Index.vue") }]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: Error404
  });
}

export default routes;
