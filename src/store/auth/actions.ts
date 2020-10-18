import axios from 'axios';
import { ActionTree } from 'vuex';
import config from '../../config';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async login(context, payload) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post(
        `${config.baseURL}/users/authenticate`,
        {
          username: payload.username,
          password: payload.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = await response.data;
      context.commit('setUser', {
        token: responseData.token,
        username: responseData.username,
        email: responseData.email,
        role: responseData.role,
      });
    } catch (error) {
      throw error.response;
    }
  },
  logout(context) {
    context.commit('clearUser');
  },
};

export default actions;
