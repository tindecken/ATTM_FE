import { TestSuiteInterface } from './TestSuite';

export interface CategoryInterface {
    Id: string;
    Name: string;
    Description: string;
    WorkItem: string;
    TestSuiteIds: string[];
    // treeNode
    nodeKey: string;
    children: TestSuiteInterface[];
    label: string;
    icon: string;
    nodeType: string;
}
