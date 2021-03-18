import { TestStepInterface } from './TestStep';

export interface TestCaseInterface {
    Id: string;
    CodeName: string;
    Name: string;
    Description: string;
    WorkItem: string;
    TestSteps: TestStepInterface[];
    nodeKey: string;
    label: string;
    icon: string;
    nodeType: string;
}
