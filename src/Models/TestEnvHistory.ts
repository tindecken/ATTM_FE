import { UpdateTestEnvDataInterface } from './Entities/UpdateTestEnvData';
import { TestEnvInterface } from './TestEnv';

export interface TestEnvHistoryInterface {
  Id: string;
  TestEnv: TestEnvInterface;
  UpdateTestEnvData: UpdateTestEnvDataInterface;
}
