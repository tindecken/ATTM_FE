import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  setUser(state: AuthStateInterface, payload) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    state.token = payload.token;
  },
  clearUser(state: AuthStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    state.token = '';
  },
  setAutoLogout(state) {
    state.didAutoLogout = true;
  },
};

export default mutation;
