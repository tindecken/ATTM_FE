export interface AuthStateInterface {
  token: string
  username: string
  role: string
  email: string,
  didAutoLogout: boolean,
}

const state: AuthStateInterface = {
  token: '',
  username: '',
  role: '',
  email: '',
  didAutoLogout: false,
};

export default state;
