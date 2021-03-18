import { TestCaseInterface } from './TestCase';

export interface TestGroupInterface {
    Id: string;
    CodeName: string;
    Name: string;
    Description: string;
    WorkItem: string;
    TestCases: TestCaseInterface[];
    children: TestCaseInterface[];
    nodeKey: string;
    label: string;
    icon: string;
    nodeType: string;
}
