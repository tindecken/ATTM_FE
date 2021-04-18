import { FlatKeywordInterface } from 'src/Models/FlatKeyword';
import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';

export interface KeywordStateInterface {
  keywordCategories: KeywordCategoryInterface[];
  selectedKeyword?: KeywordInterface;
  keywords: FlatKeywordInterface[];
}

const state: KeywordStateInterface = {
  keywordCategories: [],
  selectedKeyword: undefined,
  keywords: [],

};

export default state;
