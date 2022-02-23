import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { UserInterface } from 'src/Models/User';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route(() => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE,
    ),
  });
  Router.beforeEach((to, from, next) => {
    const user = localStorage.getItem('user')
    let IsAuthenticated = false
    if (user) {
      const userObject = JSON.parse(user) as UserInterface
      IsAuthenticated = !!userObject.Token
    }

    if (to.meta.requiresAuth && !IsAuthenticated) {
      // if require login but no token --> go to login
      next({ path: 'login' });
    } else if (to.meta.requiresUnAuth && IsAuthenticated) {
      // if no require and has token --> home
      next({ path: '/' });
    } else {
      next();
    }
  });
  return Router;
});
