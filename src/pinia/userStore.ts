import { defineStore } from 'pinia';
import { UserInterface } from '../Models/User';
import { api } from '../boot/axios';
import {ChangePasswordDataInterface} from '../Models/Entities/ChangePasswordData';
import {AxiosError} from 'axios';
import {ResponseDataInterface} from '../Models/Entities/ResponseData';

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
      try {
        const axiosResponse = await api.post(
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
        const response = await axiosResponse.data;
        this.$patch({
          Token: response.Data?.Token,
          Username: response.Data?.Username,
          Email: response.Data?.Email,
          Role: response.Data?.Role,
          Id: response.Data?.Id,
        });
        return response as ResponseDataInterface
      }catch (error) {
        if (error.isAxiosError) {
          const e: AxiosError = error;
          throw e.response.data as ResponseDataInterface;
        } else throw error;
      }
    },
    logout() {
      this.$reset();
    },
    async changePassword(payload: ChangePasswordDataInterface) {
      try {
        const userStore = useUserStore();
        const axiosResponse = await api.post('/users/changepassword', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await axiosResponse.data;
        return responseData as ResponseDataInterface;
      } catch (error) {
        if (error.isAxiosError) {
          const e: AxiosError = error;
          throw e.response.data;
        } else throw error;
      }
    }
  },
});
