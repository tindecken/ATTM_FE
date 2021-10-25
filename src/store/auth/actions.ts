import axios from 'axios';
import { ActionTree } from 'vuex';
import config from '../../config';
import { StateInterface } from '../index';
import { UserInterface } from '../../Models/User';

const actions: ActionTree<UserInterface, StateInterface> = {
  async login(context, payload) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post(
        `${config.baseURL}/users/authenticate`,
        {
          Username: payload.Username,
          Password: payload.Password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = await response.data;
      console.log('responseData', responseData);
      context.commit('setUser', {
        Token: responseData.Token,
        Username: responseData.Username,
        Email: responseData.Email,
        Role: responseData.Role,
        Id: responseData.Id,
      });
    } catch (error: any) {
      throw error.response;
    }
  },
  logout(context) {
    context.commit('clearUser');
  },
};

export default actions;
