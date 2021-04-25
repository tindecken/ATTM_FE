import { TestClientInterface } from 'src/Models/TestClient';
import { MutationTree } from 'vuex';
import { TestClientStateInterface } from './state';

const mutation: MutationTree<TestClientStateInterface> = {
  setSelectedTestClient(state: TestClientStateInterface, testClient: TestClientInterface) {
    state.selectedTestClient = testClient;
  },
  setTestClients(state: TestClientStateInterface, testClients: TestClientInterface[]) {
    state.testClients = testClients;
  },
}

export default mutation;
