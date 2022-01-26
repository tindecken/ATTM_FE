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
    LastModifiedDate: Date
    LastModifiedUser: string
    LastModifiedMessage: string
    IsDeleted: boolean
}

export { TestEnvInterface, TestEnvNodeInterface }
