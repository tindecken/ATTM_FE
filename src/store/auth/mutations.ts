import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  setUser(state: AuthStateInterface, payload) {
    state.token = payload.token;
    state.email = payload.email;
    state.role = payload.role;
    state.username = payload.username;
  },
  clearUser(state: AuthStateInterface) {
    state.token = '';
    state.email = '';
    state.role = '';
    state.username = '';
  },
  setAutoLogout(state) {
    state.didAutoLogout = true;
  },
};

export default mutation;
