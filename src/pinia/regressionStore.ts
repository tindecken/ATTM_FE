import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { api } from '../boot/axios';
import { RegressionInterface } from '../Models/Regression';
import { AddCommentDataInterface } from '../Models/Entities/AddCommentData';
import { SetRegressionQueueDataInterface } from '../Models/Entities/SetRegressionQueueData';
import { SetRegressionAnalyseStatusDataInterface } from '../Models/Entities/SetRegressionAnalyseStatusData';

export const useRegressionStore = defineStore('regression', {
  state: () => ({
    regressions: [] as RegressionInterface[],
    selectedRegression: undefined as RegressionInterface | undefined,
  }),
  getters: {},
  actions: {
    async getRegressions() {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get('/regressions/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const regressions: RegressionInterface[] = await response.data;
        this.regressions = regressions;
        if (regressions.length > 0 && this.selectedRegression === undefined) {
          this.selectedRegression = regressions[regressions.length - 1];
        }
      } catch (error: any) {
        throw error;
      }
    },
    async addCommentForRegressionTests(
      addCommentData: AddCommentDataInterface
    ) {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        return await api.post('/regressiontests/addcomment', addCommentData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
      } catch (error: any) {
        throw error;
      }
    },
    async setRegressionQueue(
      setRegressionQueuData: SetRegressionQueueDataInterface
    ) {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        return await api.post(
          '/regressiontests/setRegressionQueue',
          setRegressionQueuData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
      } catch (error: any) {
        throw error;
      }
    },
    async setRegressionAnalyseStatus(
      setRegressionAnalyseStatusData: SetRegressionAnalyseStatusDataInterface
    ) {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        return await api.post(
          '/regressiontests/setRegressionAnalyseStatus',
          setRegressionAnalyseStatusData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
      } catch (error: any) {
        throw error;
      }
    },
  },
});
