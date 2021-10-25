import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UserInterface } from '../../Models/User';

const getters: GetterTree<UserInterface, StateInterface> = {
  Email(state: UserInterface) {
    return state.Email;
  },
  Username(state: UserInterface) {
    return state.Username;
  },
  Token(state: UserInterface) {
    return state.Token;
  },
  Role(state: UserInterface) {
    return state.Role;
  },
  DidAutoLogout(state: UserInterface) {
    return state.DidAutoLogout;
  },
  Id(state: UserInterface) {
    return state.Id;
  },
  Password(state: UserInterface) {
    return state.Password;
  },
  IsAuthenticated(state: UserInterface) {
    return !!state.Token;
  },
};

export default getters;
