import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';

export interface KeywordStateInterface {
  keywordCategories: KeywordCategoryInterface[];
  selectedKeyword?: KeywordInterface;
}

const state: KeywordStateInterface = {
  keywordCategories: [],
  selectedKeyword: undefined,
};

export default state;
