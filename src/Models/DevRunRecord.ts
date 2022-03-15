export interface DevRunRecordInterface {
    Id: string;
    TestCaseId: string;
    TestCaseCodeName: string;
    TestCaseName: string;
    TestCaseFullName: string;
    Description: string;
    TestCaseType?: string;
    Status: string;
    Category?: string;
    TestSuite: string;
    TestGroup: string;
    Team?: string;
    ErrorMessage?: string;
    Log?: string;
    StartAt: Date;
    EndAt?: Date;
    WorkItem?: string;
    ExecuteTime?: number;
    RunMachine?: string;
    ErrorScreenshot?: string;
    Screenshot1?: string;
    Screenshot2?: string;
    Comments?: string;
    Buffers?: Record<string, string>;
}
