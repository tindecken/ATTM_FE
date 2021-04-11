import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import auth from './auth';
import global from './global';
import keyword from './keyword';
import category from './category';
import testcase from './testcase';
import testsuite from './testsuite';
import testgroup from './testgroup';
import testenvironment from './environment';
import { AuthStateInterface } from './auth/state';
import { GlobalStateInterface } from './global/state';
import { KeywordStateInterface } from './keyword/state';
import { CategoryStateInterface } from './category/state';
import { TestCaseStateInterface } from './testcase/state';
import { TestSuiteStateInterface } from './testsuite/state';
import { TestGroupStateInterface } from './testgroup/state';
import { TestEnvironmentStateInterface } from './environment/state';

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
  testsuite: TestSuiteStateInterface;
  testgroup: TestGroupStateInterface;
  testenvironment: TestEnvironmentStateInterface;

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
  const persistCategory = new VuexPersistence({
    key: 'category',
    modules: ['category'],
  });
  const persistTestSuite = new VuexPersistence({
    key: 'testsuite',
    modules: ['testsuite'],
  });
  const persistTestGroup = new VuexPersistence({
    key: 'testgroup',
    modules: ['testgroup'],
  });
  const persistKeyword = new VuexPersistence({
    key: 'keyword',
    modules: ['keyword'],
  });
  const persistTestCase = new VuexPersistence({
    key: 'testcase',
    modules: ['testcase'],
  });
  const persistTestEnvironment = new VuexPersistence({
    key: 'testenvironment',
    modules: ['testenvironment'],
  });
  const Store = new Vuex.Store<StateInterface>({
    modules: {
      auth,
      global,
      keyword,
      category,
      testcase,
      testsuite,
      testgroup,
      testenvironment,
    },
    plugins: [persistGlobal.plugin, persistAuth.plugin, persistKeyword.plugin, persistTestCase.plugin, persistCategory.plugin, persistTestSuite.plugin, persistTestGroup.plugin, persistTestEnvironment.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV,
  });

  return Store;
});
