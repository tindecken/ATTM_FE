import { UpdateTestEnvDataInterface } from './Entities/UpdateTestEnvData';
import { TestEnvInterface } from './TestEnv';

export interface TestEnvHistoryInterface {
    TestEnv: TestEnvInterface
    UpdateTestEnvData: UpdateTestEnvDataInterface
}
