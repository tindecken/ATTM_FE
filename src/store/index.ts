import { store } from 'quasar/wrappers';
import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
}

export default store((/* { ssrContext } */) => {
  const Store = createStore<StateInterface>({
    modules: {
    },
    plugins: [new VuexPersistence().plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV,
  });

  return Store;
});
