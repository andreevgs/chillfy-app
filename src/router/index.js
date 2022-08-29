import {createRouter, createWebHistory} from 'vue-router'
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Restore from "../views/Restore.vue";

const Profile = () => import("../views/Profile.vue");
const Users = () => import("../views/Users.vue");
const Events = () => import("../views/Events.vue");
const Event = () => import("../views/Event.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/restore",
      component: Restore,
    },
    {
      path: "/profile",
      name: "profile",
      // lazy-loaded
      component: Profile,
    },
    {
      path: "/users",
      name: "users",
      // lazy-loaded
      component: Users,
    },
    {
      path: "/events",
      name: "events",
      // lazy-loaded
      component: Events,
    },
    {
      path: "/events/:eventId",
      name: "event",
      // lazy-loaded
      component: Event,
    },
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register', '/restore'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('accessToken');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
