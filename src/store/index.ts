import { store } from 'quasar/wrappers';
import Vuex from 'vuex';

import auth from './auth';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default store(({ Vue }) => {
  Vue.use(Vuex);

  const Store = new Vuex.Store({
    modules: {
      auth,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV,
  });
  return Store;
});
