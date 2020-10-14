import { AuthStateInterface } from "./state";

export default {
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
