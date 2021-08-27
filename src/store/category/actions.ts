import { ActionTree } from 'vuex';
import axios from 'axios';
import { CategoryInterface } from 'src/Models/Category';
import { TestSuiteInterface } from 'src/Models/TestSuite';
import { StateInterface } from '../index';
import { CategoryStateInterface } from './state';
import config from '../../config';
import { paintCategories } from '../../components/Utils/TreeUtils'

const actions: ActionTree<CategoryStateInterface, StateInterface> = {
  async getAllCategories(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/categories/getAll`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      let categories: CategoryInterface[] = await response.data.result;
      categories = paintCategories(categories)
      context.commit('setCategories', categories);
    } catch (error) {
      throw error.response.data.error;
    }
  },
  setSelectedCategory(context, payload) {
    context.commit('setSelectedCategory', payload);
  },
  async createTestSuite(context, newTestSuite: TestSuiteInterface) {
    try {
      // create in database
      const response = await axios.post(
        `${config.baseURL}/categories/${newTestSuite.CategoryId}/testsuites`,
        newTestSuite,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      )
      const responseTestSuite = await response.data as TestSuiteInterface;
      context.commit('createTestSuite', responseTestSuite);
      return responseTestSuite
    } catch (error) {
      throw error.response.data;
    }
  },
  async deleteTestSuite(context, testSuite: TestSuiteInterface) {
    try {
      const response = await axios.post(
        `${config.baseURL}/categories/${testSuite.CategoryId}/testsuites/delete`,
        [testSuite.Id],
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      console.log('response', response)
      context.commit('category/deleteTestSuite', testSuite, { root: true });
      context.commit('testcase/removeOpenedTCbyTestSuite', testSuite, { root: true });
      return response
    } catch (error) {
      console.log('error.response.data', error.response.data.error);
      throw error.response.data.error;
    }
  },
  async deleteCategory(context, category: CategoryInterface) {
    try {
      const response = await axios.post(
        `${config.baseURL}/categories/delete`,
        JSON.stringify(category.Id),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      console.log('response', response)
      context.commit('category/deleteCategory', category, { root: true });
      context.commit('testcase/removeOpenedTCbyCategory', category, { root: true });
      return response
    } catch (error) {
      console.log('error.response.data', error.response.data.error);
      throw error.response.data.error;
    }
  },
  async createCategory(context, category: CategoryInterface) {
    try {
      const response = await axios.post(
        `${config.baseURL}/categories/create`,
        JSON.stringify(category),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const createdCategory = response.data.data
      context.commit('category/createCategory', createdCategory, { root: true });
      return response.data.data
    } catch (error) {
      console.log('error.response.data', error.response.data);
      throw error.response.data;
    }
  },
};

export default actions;
