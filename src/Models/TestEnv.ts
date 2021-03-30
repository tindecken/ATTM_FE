import { TestEnvCategoryInterface } from './TestEnvCategory';

export interface TestEnvInterface {
    Id: string;
    Name: string;
    Description?: string;
    Categories?: TestEnvCategoryInterface[]
}
