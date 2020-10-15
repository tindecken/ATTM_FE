import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  email(state: AuthStateInterface) {
    return state.email;
  },
  userName(state: AuthStateInterface) {
    return state.username;
  },
  token(state: AuthStateInterface) {
    return state.token;
  },
  isAuthenticated(state: AuthStateInterface) {
    return !!state.token;
  },
  didAutoLogout(state: AuthStateInterface) {
    return state.didAutoLogout;
  },
};

export default getters;
