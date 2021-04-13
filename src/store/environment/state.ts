import { TestEnvInterface } from 'src/Models/TestEnv';

export interface TestEnvironmentStateInterface {
  testEnvs: TestEnvInterface[];
  selectedTestEnv?: TestEnvInterface
}

const state: TestEnvironmentStateInterface = {
  testEnvs: [],
  selectedTestEnv: undefined,
};

export default state;
