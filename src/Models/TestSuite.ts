import { TestGroupInterface } from './TestGroup';

export interface TestSuiteInterface {
    Id: string;
    CodeName: string;
    Name: string;
    Description?: string;
    WorkItem?: string;
    TestGroupIds: TestGroupInterface[];
    CategoryId: string;
    children?: TestGroupInterface[];
    nodeKey?: string;
    label?: string;
    icon?: string;
    nodeType?: string;
}
