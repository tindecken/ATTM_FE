import { ActionTree } from 'vuex';
import axios from 'axios';
import { RegressionInterface } from 'src/Models/Regression';
import { StateInterface } from '../index';
import { RegressionStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<RegressionStateInterface, StateInterface> = {
  async getRegressions(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/regressions/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const regressions: RegressionInterface[] = await response.data;
      context.commit('setRegressions', regressions);
      if (regressions.length > 0) {
        context.commit('setSelectedRegression', regressions[0]);
      }
    } catch (error) {
      throw error;
    }
  },
};

export default actions;
