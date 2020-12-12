export interface TestCaseStateInterface {
  opennedTCs: any;
  opennedSelectedTC: string
}

const state: TestCaseStateInterface = {
  opennedTCs: [],
  opennedSelectedTC: '',
};

export default state;
