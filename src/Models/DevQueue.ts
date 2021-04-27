import { TestClientInterface } from './TestClient';

export interface DevQueueInterface {
    Id: string;
    TestCaseId: string;
    TestCaseCodeName: string;
    TestCaseName: string;
    TestCaseFullName: string;
    Log?: string;
    Status: string;
    Exception?: string;
    Type: string;
    CreateAt: Date;
    RunAt?: Date;
    EndAt?: Date;
    Error?: string;
    Client: TestClientInterface;
    ErrorScreenshot?: string;
    Comments?: string;
}
