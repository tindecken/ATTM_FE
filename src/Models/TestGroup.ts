import { TestCaseInterface } from './TestCase';

export interface TestGroupInterface {
    Id: string;
    CodeName: string;
    Name: string;
    Description?: string;
    WorkItem?: string;
    TestCaseIds?: string[];
    CategoryId: string;
    TestSuiteId: string;
    children: TestCaseInterface[];
    nodeKey?: string;
    label?: string;
    icon?: string;
    nodeType?: string;
}
