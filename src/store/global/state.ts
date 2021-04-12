import { TestAUTInterface } from 'src/Models/TestAUT';
import { TestEnvInterface } from 'src/Models/TestEnv';

export interface GlobalStateInterface {
  darkTheme: boolean,
  testAUTs: TestAUTInterface[],
  selectedTestEnv: TestEnvInterface | undefined,
}

const state: GlobalStateInterface = {
  darkTheme: true,
  testAUTs: [],
  selectedTestEnv: undefined,
};

export default state;
