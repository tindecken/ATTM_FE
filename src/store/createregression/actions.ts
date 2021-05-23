import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';
import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { StateInterface } from '../index';
import { CreateRegressionStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<CreateRegressionStateInterface, StateInterface> = {
  async createRegression(context, regression: DefineRegressionInterface) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axios.post(
        `${config.baseURL}/regressions`,
        regression,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  },
  async getAllTestCaseDetails(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/testcases/getAllDetail`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const testcases = await response.data;
      context.commit('setAllTestCasesDetail', testcases.data);
    } catch (error) {
      throw error;
    }
  },
  async getAndAddSelectedTestCase(context, selectedTestCasesDetail: TestCaseDetailInterface[]) {
    const promises: any = []
    selectedTestCasesDetail.forEach((tc: TestCaseDetailInterface) => {
      promises.push(axios.get(`${config.baseURL}/testcases/${tc.Id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.rootGetters['auth/token']}`,
        },
      }))
    })
    // eslint-disable-next-line no-useless-catch
    try {
      await Promise.all(promises).then((results) => {
        results.forEach((response: any) => {
          context.commit('addSelectedTestCase', response.data)
        })
      }).catch((error: any) => { throw error })
    } catch (error) {
      throw error;
    }
  },
  async createRegressionTests(context, payload: any) {
    // eslint-disable-next-line no-useless-catch
    try {
      const { regressionId } = payload
      const { selectedTestCasesDetailIds } = payload
      console.log('regressionId', regressionId)
      console.log('selectedTestCasesDetailIds', selectedTestCasesDetailIds)
      return await axios.post(
        `${config.baseURL}/regressions/${regressionId}/createregressiontests`,
        selectedTestCasesDetailIds,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      )
    } catch (error) {
      throw error;
    }
  },
};

export default actions;
