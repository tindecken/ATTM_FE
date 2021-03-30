import { TestParamInterface } from './TestParam';

export interface KeywordInterface {
    Name: string;
    Description?: string;
    Owner?: string;
    Params?: TestParamInterface[];
    CreatedDate?: Date;
    ImageDescriptionIds?: string[];
}
