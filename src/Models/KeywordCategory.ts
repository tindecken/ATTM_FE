import { KeywordFeatureInterface } from './KeywordFeature';

export interface KeywordCategoryInterface {
    Id: string;
    Name: string;
    Description?: string;
    Features?: KeywordFeatureInterface[];
}
