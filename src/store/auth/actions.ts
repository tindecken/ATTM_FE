/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { ActionTree } from 'vuex';
import config from '../../config';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

function setAxiosHeaders(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async login(context : any, payload: any) {
    const response = await axios.post(
      `${config.baseURL}/users/authenticate`,
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        username: payload.username,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        password: payload.password,
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
      token: responseData.token,
      username: responseData.username,
      email: responseData.email,
      role: responseData.role,
    });
    setAxiosHeaders(responseData.token);
  },
};

export default actions;
