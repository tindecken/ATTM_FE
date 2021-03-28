import { TestAUTInterface } from "src/Models/TestAUT";

export interface GlobalStateInterface {
  darkTheme: boolean,
  testAUTs: TestAUTInterface[],
}

const state: GlobalStateInterface = {
  darkTheme: true,
  testAUTs: [],
};

export default state;
