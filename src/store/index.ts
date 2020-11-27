import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import auth from './auth';
import global from './global';
import keyword from './keyword';
import category from './category';
import testcase from './testcase';
import { AuthStateInterface } from './auth/state';
import { GlobalStateInterface } from './global/state';
import { KeywordStateInterface } from './keyword/state';
import { CategoryStateInterface } from './category/state';
import { TestCaseStateInterface } from './testcase/state';

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  auth: AuthStateInterface;
  global: GlobalStateInterface;
  keyword: KeywordStateInterface;
  category: CategoryStateInterface;
  testcase: TestCaseStateInterface;
}

export default store(({ Vue }) => {
  Vue.use(Vuex);

  const persistGlobal = new VuexPersistence({
    key: 'global',
    modules: ['global'],
  });
  const persistAuth = new VuexPersistence({
    key: 'auth',
    modules: ['auth'],
  });
  const persistKeyword = new VuexPersistence({
    key: 'keyword',
    modules: ['keyword'],
  });
  const persistTestCase = new VuexPersistence({
    key: 'testcase',
    modules: ['testcase'],
  });
  const Store = new Vuex.Store<StateInterface>({
    modules: {
      auth,
      global,
      keyword,
      category,
      testcase,
    },
    plugins: [persistGlobal.plugin, persistAuth.plugin, persistKeyword.plugin, persistTestCase.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV,
  });

  return Store;
});
