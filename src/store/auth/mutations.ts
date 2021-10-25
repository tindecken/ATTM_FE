import { MutationTree } from 'vuex';
import { UserInterface } from '../../Models/User';

const mutation: MutationTree<UserInterface> = {
  setUser(state: UserInterface, payload) {
    state.Token = payload.Token;
    state.Email = payload.Email;
    state.Role = payload.Role;
    state.Username = payload.Username;
    state.Password = payload.Password;
    state.Id = payload.Id;
    state.DidAutoLogout = payload.DidAutoLogout || false;
  },
  clearUser(state: UserInterface) {
    state.Token = '';
    state.Email = '';
    state.Role = '';
    state.Username = '';
    state.Password = '';
    state.Id = '';
    state.DidAutoLogout = false;
  },
  setAutoLogout(state) {
    state.DidAutoLogout = true;
  },
};

export default mutation;
