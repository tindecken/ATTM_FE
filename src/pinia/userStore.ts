import { defineStore } from 'pinia'
import { UserInterface } from 'src/Models/User'
import { api } from 'boot/axios'

const user: UserInterface = {
  Id: '',
  Token: '',
  Username: '',
  Role: '',
  Email: '',
  DidAutoLogout: false,
  Password: '',
}
export const useUserStore = defineStore('user', {
  state: () => ({
    Id: user.Id,
    Token: user.Token,
    Username: user.Username,
    Role: user.Role,
    Email: user.Email,
    DidAutoLogout: user.DidAutoLogout,
    Password: user.Password,
  }),
  getters: {
    IsAuthenticated: (state) => !!state.Token,
  },
  actions: {
    async login(payload: any) {
      const response = await api.post(
        '/users/authenticate',
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
      this.$patch({
        Token: responseData.Token,
        Username: responseData.Username,
        Email: responseData.Email,
        Role: responseData.Role,
        Id: responseData.Id,
      })
    },
    logout() {
      this.$reset()
    },
  },
})
