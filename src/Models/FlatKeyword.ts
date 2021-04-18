import { TestParamInterface } from './TestParam';

export interface FlatKeywordInterface {
    Name: string;
    Description?: string;
    Owner?: string;
    Params: TestParamInterface[];
    CreatedDate?: Date;
    ImageDescriptionIds?: string[];
    Category: string;
    Feature: string;
}
