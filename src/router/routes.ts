import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('components/Home.vue'),
  },
  {
    path: '/login',
    component: () => import('components/Login.vue'),
  },
  {
    path: '/home',
    component: () => import('components/Home.vue'),
  },
  {
    path: '*',
    redirect: '/',
  },
];

export default routes;
