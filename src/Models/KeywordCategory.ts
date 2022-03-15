import { KeywordFeatureInterface } from './KeywordFeature';

export interface KeywordCategoryInterface {
    Name: string;
    Description?: string;
    Features?: KeywordFeatureInterface[];
}
