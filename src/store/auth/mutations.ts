import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  setUser(state: AuthStateInterface, payload) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    state.token = payload.token;
    state.email = payload.email;
    state.role = payload.role;
    state.username = payload.username;
  },
  clearUser(state: AuthStateInterface) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
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
