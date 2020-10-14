import { RouteConfig } from 'vue-router';
import Store from '../store/index';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('components/Home.vue'),
    beforeEnter(to, from, next) {
      if () {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/login',
    component: () => import('components/Login.vue'),
  },
  {
    path: '/home',
    component: () => import('components/Home.vue'),
    beforeEnter(to, from, next) {
      if (Store.getters[]) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '*',
    redirect: '/',
  },
];

export default routes;
