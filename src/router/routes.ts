import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('components/Home.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/testplan',
      },
      {
        path: '/home',
        redirect: '/testplan',
      },
      {
        path: '/testplan',
        component: () => import('components/TestPlan/TestPlan.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/regression',
        component: () => import('components/Regression/Regression.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/createregression',
        component: () => import('src/components/Regression/CreateRegression/CreateRegression.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('components/Login.vue'),
    meta: {
      requiresUnAuth: true,
    },
  },
  {
    path: '*',
    redirect: '/login',
  },
];

export default routes;
