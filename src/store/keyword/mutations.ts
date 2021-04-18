import { FlatKeywordInterface } from 'src/Models/FlatKeyword';
import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
import { KeywordFeatureInterface } from 'src/Models/KeywordFeature';
import { MutationTree } from 'vuex';
import { KeywordStateInterface } from './state';

const mutation: MutationTree<KeywordStateInterface> = {
  setSelectedKeyword(state: KeywordStateInterface, keyword: KeywordInterface) {
    state.selectedKeyword = keyword;
  },
  setKeywordCategories(state: KeywordStateInterface, kwCategories: KeywordCategoryInterface[]) {
    state.keywordCategories = kwCategories;
  },
  setKeywords(state: KeywordStateInterface, keywordCategories: KeywordCategoryInterface[]) {
    const keywords: FlatKeywordInterface[] = [];
    keywordCategories.forEach((kwCategory: KeywordCategoryInterface) => {
      if (kwCategory.Features) {
        kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
          if (kwFeature.Keywords) {
            kwFeature.Keywords.forEach((kw: KeywordInterface) => {
              const flatKeyword: FlatKeywordInterface = { ...kw, Category: kwCategory.Name, Feature: kwFeature.Name }
              keywords.push(flatKeyword);
            })
          }
        })
      }
    })
    state.keywords = keywords;
  },
};

export default mutation;
