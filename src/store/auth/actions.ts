/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { ActionTree } from 'vuex';
import config from '../../config';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async login(context : any, payload: any) {
    const response = await axios.post(
      `${config.baseURL}/users/authenticate`,
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Username: payload.username,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Password: payload.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseData = await response.data;
    if (!response) {
      const error = new Error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        responseData.message || 'Failed to authenticate. Check your login data.',
      );
      throw error;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    context.commit('setUser', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      token: responseData.Token,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    localStorage.setItem('token', responseData.Token);
  },
  trylogin(context) {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('token', token);
      context.commit('setUser', { token });
    } else {
      context.commit('clearUser');
    }
  },
};

export default actions;
