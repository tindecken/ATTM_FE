import { TestStepInterface } from './TestStep';

export interface TestCaseInterface {
    Id: string;
    CodeName: string;
    Name: string;
    Description?: string;
    WorkItem?: string;
    TestSteps: TestStepInterface[];
    TestCaseType?: string;
    LastRunningStatus?: string;
    IsPrimary?: boolean;
    IsDisabled?: boolean;
    IsDeleted?: boolean;
    Owner?: string;
    Team?: string;
    CreatedDate?: Date;
    LastModifiedUser?: string;
    LastModifiedDate?: Date;
    TimeOutInMinutes?: number;
    QueueId?: number;
    CategoryId: string;
    TestSuiteId: string;
    TestGroupId: string;
    nodeKey?: string;
    label?: string;
    icon?: string;
    nodeType?: string;
}
