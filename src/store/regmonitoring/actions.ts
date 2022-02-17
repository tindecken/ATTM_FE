import { ActionTree } from 'vuex';
import axios from 'axios';
import { RegressionTestInterface } from 'src/Models/RegressionTest';
import { useUserStore } from 'src/pinia/userStore';
import { StateInterface } from '../index';
import { RegMonitoringStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<RegMonitoringStateInterface, StateInterface> = {
  async getRegressionDetail(context: any, regressionId: string) {
    try {
      const userStore = useUserStore()
      const response = await axios.get(
        `${config.baseURL}/regressions/${regressionId}/getdetail`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data
      const regressionTests = await responseData.data as RegressionTestInterface [];
      context.commit('setRegTests', regressionTests);
      const categories = regressionTests.map((regTest: RegressionTestInterface) => regTest.CategoryName).filter((value, index, self) => self.indexOf(value) === index)
      context.commit('setCategorySelections', categories);
      const testSuites = regressionTests.map((regTest: RegressionTestInterface) => regTest.TestSuiteFullName).filter((value, index, self) => self.indexOf(value) === index)
      context.commit('setTestSuiteSelections', testSuites);
      const testGroups = regressionTests.map((regTest: RegressionTestInterface) => regTest.TestGroupFullName).filter((value, index, self) => self.indexOf(value) === index)
      context.commit('setTestGroupSelections', testGroups);
      const testClients = regressionTests.map((regTest: RegressionTestInterface) => regTest.ClientName).filter((value, index, self) => self.indexOf(value) === index && value !== '')
      context.commit('setTestClientSelections', testClients);
    } catch (error: any) {
      throw error.response.data
    }
  },
  async getScreenshot(context: any, screenshotId: string) {
    const userStore = useUserStore()
    try {
      const response = await axios.get(
        `${config.baseURL}/gridfsbucket/${screenshotId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data
      return responseData.data
    } catch (error: any) {
      throw error.response.data
    }
  },
};

export default actions;
