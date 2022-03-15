import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { FlatKeywordInterface } from '../Models/FlatKeyword';
import { KeywordInterface } from '../Models/Keyword';
import { KeywordCategoryInterface } from '../Models/KeywordCategory';
import { api } from '../boot/axios';
import { KeywordFeatureInterface } from '../Models/KeywordFeature';

export const useKeywordStore = defineStore('keyword', {
  state: () => ({
    keywordCategories: [] as KeywordCategoryInterface[],
    selectedKeyword: {} as KeywordInterface,
    keywords: [] as FlatKeywordInterface[],
  }),
  getters: {},
  actions: {
    async getKeywords() {
      const userStore = useUserStore();
      const response = await api.get('/keywords/getkeywords', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.Token}`,
        },
      });
      const responseData = await response.data;
      console.log('responseData', responseData);
      const keywordCategories: KeywordCategoryInterface[] = await responseData
        .data.Categories;
      this.keywordCategories = keywordCategories;
      this.setKeywords(keywordCategories);
      return keywordCategories;
    },
    setKeywords(keywordCategories: KeywordCategoryInterface[]) {
      const keywords: FlatKeywordInterface[] = [];
      keywordCategories.forEach((kwCategory: KeywordCategoryInterface) => {
        if (kwCategory.Features) {
          kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
            if (kwFeature.Keywords) {
              kwFeature.Keywords.forEach((kw: KeywordInterface) => {
                const flatKeyword: FlatKeywordInterface = {
                  ...kw,
                  Category: kwCategory.Name,
                  Feature: kwFeature.Name,
                };
                keywords.push(flatKeyword);
              });
            }
          });
        }
      });
      this.keywords = keywords;
    },
  },
});
