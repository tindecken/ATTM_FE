import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestClientInterface } from 'src/Models/TestClient';
import { useUserStore } from 'src/pinia/userStore';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<GlobalStateInterface, StateInterface> = {
  switchDarkTheme(context) {
    context.commit('switchTheme');
  },

  async buildProject() {
    const userStore = useUserStore()
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/buildproject`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      console.log('response', response)
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  async copydevcodetoclient(context, testClient: TestClientInterface) {
    const userStore = useUserStore()
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/copycodetoclient/dev`,
        testClient,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  async checkautorunner(context, testClient: TestClientInterface) {
    const userStore = useUserStore()
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/checkrunner/Runner`,
        testClient,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  async copyregcodetoclient(context, testClient: TestClientInterface) {
    const userStore = useUserStore()
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/copycodetoclient/reg`,
        testClient,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  async updatereleaseforclient(context, payload: any) {
    const userStore = useUserStore()
    const testClient = payload.testClient as TestClientInterface;
    const newValue = payload.regressionName as string;
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/updatereleaseforclient/${newValue}`,
        testClient,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      console.log('response', response)
      const responseData = await response.data;
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  async getLatestCode() {
    const userStore = useUserStore()
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/getlatestcode`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      console.log('response', response)
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  async generateDevCode(context, testcases) {
    const userStore = useUserStore()
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/generateDevCode`,
        testcases,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  async generateRegCode(context, testcasesDetail) {
    const userStore = useUserStore()
    console.log('testcasesDetail', testcasesDetail)
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/generateRegCode`,
        testcasesDetail,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  async createDevQueue(context, payload) {
    const userStore = useUserStore()
    console.log('payload', payload);
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/createdevqueue`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error: any) {
      throw error.response.data
    }
  },
  async getTestAUT(context) {
    const userStore = useUserStore()
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/testauts`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      context.commit('setTestAUTs', {
        testAUTs: responseData,
      });
    } catch (error: any) {
      throw error.response.data
    }
  },
};
export default actions
