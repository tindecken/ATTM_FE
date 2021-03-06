/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { route } from 'quasar/wrappers';
import VueRouter from 'vue-router';
import { Store } from 'vuex';
import { StateInterface } from '../store';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route<Store<StateInterface>>(({ store, Vue }) => {
  Vue.use(VueRouter);

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });
  Router.beforeEach((to, from, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
      // if require login but no token --> go to login
      next({ path: 'login' });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (to.meta.requiresUnAuth && store.getters['auth/isAuthenticated']) {
      // if no require and has token --> home
      next({ path: '/' });
    } else {
      next();
    }
  });
  return Router;
});
