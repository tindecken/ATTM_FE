import { TestEnvNodeInterface } from './TestEnvNode';

export interface TestEnvCategoryInterface {
    Name: string;
    Description?: string;
    Nodes?: TestEnvNodeInterface[];
}
