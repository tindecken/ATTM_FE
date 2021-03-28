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
      console.log('getAllCategories', categories)
      context.commit('setCategories', categories);
    } catch (error) {
      console.log('getAllCategories', error.response.data)
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
      // create in vuex
      context.commit('createTestSuite', responseTestSuite);
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default actions;
