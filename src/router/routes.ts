import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
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
        path: '/devmonitoring',
        component: () => import('components/DevMonitoring/DevMonitoring.vue'),
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
      {
        path: '/settings',
        component: () => import('src/components/Settings/Settings.vue'),
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
    path: '/:catchAll(.*)*',
    redirect: '/login',
  },
];

export default routes;
