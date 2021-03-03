import { ActionTree } from 'vuex';
import axios from 'axios';
import { StateInterface } from '../index';
import { TestGroupStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<TestGroupStateInterface, StateInterface> = {
  async createTestCase(context, payload) {
    try {
      // get CategoryName by categoryId
      const catResponse = await axios.get(
        `${config.baseURL}/categories/${payload.catId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      )
      const catData = await catResponse.data
      console.log('catData', catData)
      // get TestSuiteName by testSuitId
      const tsResponse = await axios.get(
        `${config.baseURL}/testsuites/${payload.tsId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      )
      const tsData = await tsResponse.data
      console.log('tsData', catData)
      // create in database
      payload.CategoryName = catData.name
      payload.TestSuiteId = tsData.name
      payload.TestGroupId = payload.tgName
      console.log('payload', payload)
      const response = await axios.post(
        `${config.baseURL}/testgroups/${payload.tgId}/testcases`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      )
      const responseData = await response.data;
      // create in vuex
      // commit to category module
      context.commit('category/createTestCase', {
        catId: payload.catId,
        tsId: payload.tsId,
        tgId: payload.tgId,
        tc: responseData,
      }, { root: true });
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default actions;
