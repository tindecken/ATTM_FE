import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { TestClientInterface } from '../Models/TestClient';
import { useUserStore } from './userStore';

export const useTestClientStore = defineStore('testClient', {
  state: () => ({
    testClients: [] as TestClientInterface[],
    selectedTestClient: undefined as TestClientInterface | undefined,
  }),
  actions: {
    async getTestClients() {
      const userStore = useUserStore();
      const response = await api.get('/testclients/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.Token}`,
        },
      });
      const testClients: TestClientInterface[] = await response.data;
      this.testClients = testClients;
    },
    async ping(ip: string) {
      const userStore = useUserStore();
      const response = await api.get(`/testclients/ping/${ip}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.Token}`,
        },
      });
      const result = await response.data;
      return result;
    },
  },
});
