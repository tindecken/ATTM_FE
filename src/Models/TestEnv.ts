interface TestEnvNodeInterface {
  Category: string;
  Name: string;
  Value: string;
  Description?: string;
}
interface TestEnvInterface {
    Id: string;
    Name: string;
    Description?: string;
    Nodes: TestEnvNodeInterface[]
}

export { TestEnvInterface, TestEnvNodeInterface }
