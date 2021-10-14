import { ActionTree } from 'vuex';
import axios from 'axios';
import { RegressionInterface } from 'src/Models/Regression';
import { AddCommentDataInterface } from 'src/Models/Entities/AddCommentData';
import { SetRegressionQueueDataInterface } from 'src/Models/Entities/SetRegressionQueueData';
import { SetRegressionAnalyseStatusDataInterface } from 'src/Models/Entities/SetRegressionAnalyseStatusData';
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
      if (regressions.length > 0 && context.state.selectedRegression === undefined) {
        context.commit('setSelectedRegression', regressions[regressions.length - 1]);
      }
    } catch (error: any) {
      throw error;
    }
  },
  async addCommentForRegressionTests(context: any, addCommentData: AddCommentDataInterface) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axios.post(
        `${config.baseURL}/regressiontests/addcomment`,
        addCommentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
    } catch (error: any) {
      throw error;
    }
  },
  async setRegressionQueue(context: any, setRegressionQueuData: SetRegressionQueueDataInterface) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axios.post(
        `${config.baseURL}/regressiontests/setRegressionQueue`,
        setRegressionQueuData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
    } catch (error: any) {
      throw error;
    }
  },
  async setRegressionAnalyseStatus(context: any, setRegressionAnalyseStatusData: SetRegressionAnalyseStatusDataInterface) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axios.post(
        `${config.baseURL}/regressiontests/setRegressionAnalyseStatus`,
        setRegressionAnalyseStatusData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
    } catch (error: any) {
      throw error;
    }
  },
};

export default actions;
