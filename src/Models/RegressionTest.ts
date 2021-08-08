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
    CategoryName: string,
    Description: string,
    TestSuiteFullName: string,
    TestGroupFullName: string,
    IsHighPriority: boolean,
    TestCaseType: string,
    Team: string,
    Status: string,
    WorkItem: string,
    Queue: string,
    Owner: string,
    RegressionRunRecordIds: string[],
    LastRegressionRunRecord: RegressionRunRecordInterface,
    AnalyseBy: string,
    Issue: string,
    Comment: string
}
