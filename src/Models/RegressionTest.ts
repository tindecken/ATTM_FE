import { RegressionRunRecordInterface } from './RegressionRunRecord';

export interface RegressionTestInterface {
    Id: string,
    TestCaseId: string,
    Regression: string,
    Release: string,
    Build: string,
    TestCaseCodeName: string,
    TestCaseName: string,
    TestCaseFullCodeName: string,
    TestCaseType: string,
    Description: string,
    Team: string,
    CategoryName: string,
    TestSuiteFullName: string,
    TestGroupFullName: string,
    IsHighPriority: boolean,
    Status: string,
    ClientName: string,
    WorkItem: string,
    Queue: string,
    Owner: string,
    RegressionRunRecordIds: string[],
    LastRegressionRunRecord: RegressionRunRecordInterface,
    AnalyseBy: string,
    Issue: string,
    Comments: string
}
