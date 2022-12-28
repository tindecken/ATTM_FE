import { defineStore } from 'pinia';
import { UserInterface } from '../Models/User';
import { api } from '../boot/axios';
import {ChangePasswordDataInterface} from '../Models/Entities/ChangePasswordData';
import {AxiosError} from 'axios';

const user: UserInterface = {
  Id: '',
  Token: '',
  Username: '',
  Role: '',
  Email: '',
  DidAutoLogout: false,
  Password: '',
};
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
        }
      );
      const responseData = await response.data;
      this.$patch({
        Token: responseData.Token,
        Username: responseData.Username,
        Email: responseData.Email,
        Role: responseData.Role,
        Id: responseData.Id,
      });
    },
    logout() {
      this.$reset();
    },
    async changePassword(payload: ChangePasswordDataInterface) {
      try {
        const userStore = useUserStore();
        const response = await api.post('/users/changepassword', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        return responseData;
      } catch (error) {
        console.log('e', error);
        if (error.isAxiosError) {
          const e: AxiosError = error;
          throw e.response.data;
        } else {
          throw error;
        }
      }
    }
  },
});
