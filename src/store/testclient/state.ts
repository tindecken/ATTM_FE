import { TestClientInterface } from 'src/Models/TestClient';

export interface TestClientStateInterface {
  testClients: TestClientInterface[];
  selectedTestClient?: TestClientInterface
}

const state: TestClientStateInterface = {
  testClients: [],
  selectedTestClient: undefined,
};

export default state;
