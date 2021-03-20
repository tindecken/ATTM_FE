import { TestStepInterface } from './TestStep';

export interface TestCaseInterface {
    Id: string;
    CodeName: string;
    Name: string;
    Description?: string;
    WorkItem?: string;
    TestSteps?: TestStepInterface[];
    TestCaseType?: string;
    LastRunningStatus?: string;
    IsPrimary?: boolean;
    IsDisabled?: boolean;
    IsDeleted?: boolean;
    Designer?: string;
    Team?: string;
    CreatedDate?: Date;
    LastModifiedDate?: Date;
    TimeOutInMinutes?: number;
    CategoryId: string;
    TestSuiteId: string;
    TestGroupId: string;
    nodeKey?: string;
    label?: string;
    icon?: string;
    nodeType?: string;
}
