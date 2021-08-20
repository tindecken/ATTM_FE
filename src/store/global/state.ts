import { TestAUTInterface } from 'src/Models/TestAUT';
import { InfoStatusDataInterface } from 'src/Models/Entities/InfoStatusData';

export interface GlobalStateInterface {
  darkTheme: boolean,
  testAUTs: TestAUTInterface[],
  infoStatus: InfoStatusDataInterface,
}

const state: GlobalStateInterface = {
  darkTheme: true,
  testAUTs: [],
  infoStatus: {} as InfoStatusDataInterface,
};

export default state;
