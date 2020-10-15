import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/home',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    component: () => import('components/Login.vue'),
    meta: {
      requiresUnAuth: true,
    },
  },
  {
    path: '/home',
    component: () => import('components/Home.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '*',
    redirect: '/',
  },
];

export default routes;
