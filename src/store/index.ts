import { store } from 'quasar/wrappers';
import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';
import createregression from './createregression';
import devmonitoring from './devmonitoring';
import regression from './regression';
import regmonitoring from './regmonitoring';
import setting from './setting';

import { CreateRegressionStateInterface } from './createregression/state';
import { DevMonitoringStateInterface } from './devmonitoring/state';
import { RegressionStateInterface } from './regression/state';
import { RegMonitoringStateInterface } from './regmonitoring/state';
import { SettingStateInterface } from './setting/state';

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
  createregression: CreateRegressionStateInterface;
  devmonitoring: DevMonitoringStateInterface;
  regression: RegressionStateInterface;
  regmonitoring: RegMonitoringStateInterface;
  setting: SettingStateInterface;
}

export default store((/* { ssrContext } */) => {
  const persistCreateRegression = new VuexPersistence({
    key: 'createregression',
    modules: ['createregression'],
  });
  const persistDevMonitoring = new VuexPersistence({
    key: 'devmonitoring',
    modules: ['devmonitoring'],
  });
  const persistRegression = new VuexPersistence({
    key: 'regression',
    modules: ['regression'],
  });
  const persistRegMonitoring = new VuexPersistence({
    key: 'regmonitoring',
    modules: ['regmonitoring'],
  });
  const persistSetting = new VuexPersistence({
    key: 'setting',
    modules: ['setting'],
  });

  const Store = createStore<StateInterface>({
    modules: {
      createregression,
      devmonitoring,
      regression,
      regmonitoring,
      setting,
    },
    plugins: [new VuexPersistence().plugin, persistCreateRegression.plugin, persistDevMonitoring.plugin, persistRegression.plugin, persistRegMonitoring.plugin, persistSetting.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV,
  });

  return Store;
});
