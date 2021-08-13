const allColumns = [
  {
    name: 'testCaseFullName',
    align: 'left',
    label: 'Test Case',
    field: 'TestCaseFullName',
    sortable: true,
    style: 'min-width: 80px; max-width: 300px',
    headerStyle: 'min-width: 80px; max-width: 300px',
    classes: 'ellipsis',
  },
  {
    name: 'category',
    label: 'Category',
    field: 'CategoryName',
    sortable: true,
    align: 'left',
    style: 'min-width: 100px;',
    headerStyle: 'min-width: 100px',
    classes: 'ellipsis',
  },
  {
    name: 'testSuite',
    label: 'Test Suite',
    field: 'TestSuiteFullName',
    sortable: true,
    align: 'left',
    style: 'min-width: 120px;',
    headerStyle: 'min-width: 120px',
    classes: 'ellipsis',
  },
  {
    name: 'testGroup',
    label: 'Test Group',
    field: 'TestGroupFullName',
    sortable: true,
    align: 'left',
    style: 'min-width: 120px;',
    headerStyle: 'min-width: 120px',
    classes: 'ellipsis',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'Status',
    sortable: true,
    align: 'left',
    style: 'min-width: 70px; max-width: 90px;',
    headerStyle: 'min-width: 70px; max-width: 90px;',
    classes: 'ellipsis',
  },
  {
    name: 'clientName',
    label: 'Client',
    field: 'ClientName',
    sortable: true,
    align: 'left',
    style: 'min-width: 70px; max-width: 90px;',
    headerStyle: 'min-width: 70px; max-width: 90px;',
    classes: 'ellipsis',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'Description',
    sortable: true,
    align: 'left',
    style: 'min-width: 135px;',
    headerStyle: 'min-width: 135px',
    classes: 'ellipsis',
  },
  {
    name: 'testCaseType',
    label: 'Type',
    field: 'TestCaseType',
    sortable: true,
    align: 'left',
    style: 'min-width: 90px;',
    headerStyle: 'min-width: 90px',
    classes: 'ellipsis',
  },
  {
    name: 'team',
    label: 'Team',
    field: 'Team',
    sortable: true,
    align: 'left',
    style: 'min-width: 90; max-width: 110px;',
    headerStyle: 'min-width: 90px; min-width: 110px;',
    classes: 'ellipsis',
  },
  {
    name: 'errorMessage',
    label: 'Error Message',
    field: 'ErrorMessage',
    sortable: true,
    align: 'left',
    style: 'min-width: 135px; max-width: 200px',
    headerStyle: 'max-width: 200px',
    classes: 'ellipsis',
  },
  {
    name: 'log',
    label: 'Running Log',
    field: 'Log',
    sortable: true,
    align: 'left',
    style: 'min-width: 135px; max-width: 200px',
    headerStyle: 'max-width: 200px',
    classes: 'ellipsis',
  },
  {
    name: 'errorScreenShot',
    label: 'Error ScreenShot',
    field: 'ErrorScreenshot',
    sortable: false,
    align: 'left',
    style: 'min-width: 100px; max-width: 110px;',
    headerStyle: 'min-width: 100px; max-width: 110px;',
  },
  {
    name: 'startAt',
    label: 'Start At',
    field: 'StartAt',
    sortable: true,
    align: 'left',
    style: 'min-width: 100px; max-width: 120px;',
    headerStyle: 'min-width: 100px max-width: 120px;',
    classes: 'ellipsis',
  },
  {
    name: 'endAt',
    label: 'End At',
    field: 'EndAt',
    sortable: true,
    align: 'left',
    style: 'min-width: 100px; max-width: 120px;',
    headerStyle: 'min-width: 100px max-width: 120px;',
    classes: 'ellipsis',
  },
  {
    name: 'executeTime',
    label: 'Execute Time',
    field: 'Execute Time',
    sortable: true,
    align: 'left',
    style: 'min-width: 80px;',
    headerStyle: 'min-width: 80px',
    classes: 'ellipsis',
  },
  {
    name: 'workItem',
    label: 'Work Item',
    field: 'WorkItem',
    sortable: true,
    align: 'left',
    style: 'min-width: 135px;',
    headerStyle: 'min-width: 135px',
    classes: 'ellipsis',
  },
  {
    name: 'queue',
    label: 'Queue',
    field: 'Queue',
    sortable: true,
    align: 'left',
    style: 'min-width: 135px;',
    headerStyle: 'min-width: 135px',
    classes: 'ellipsis',
  },
  {
    name: 'isHighPriority',
    label: 'Is HighPriority',
    field: 'IsHighPriority',
    sortable: true,
    align: 'left',
    style: 'min-width: 135px;',
    headerStyle: 'min-width: 135px',
    classes: 'ellipsis',
  },
  {
    name: 'owner',
    label: 'Owner',
    field: 'Owner',
    sortable: true,
    align: 'left',
    style: 'min-width: 135px;',
    headerStyle: 'min-width: 135px',
    classes: 'ellipsis',
  },
  {
    name: 'analyseBy',
    label: 'Analyse By',
    field: 'AnalyseBy',
    sortable: false,
    align: 'left',
    style: 'min-width: 100px;; max-width: 150px;',
    headerStyle: 'min-width: 100px; max-width: 150px;',
    classes: 'ellipsis',
  },
  {
    name: 'issue',
    label: 'Issue',
    field: 'Issue',
    sortable: false,
    align: 'left',
    style: 'min-width: 100px;; max-width: 150px;',
    headerStyle: 'min-width: 100px; max-width: 150px;',
    classes: 'ellipsis',
  },
  {
    name: 'comment',
    label: 'Comment',
    field: 'Comment',
    sortable: false,
    align: 'left',
    style: 'min-width: 100px;; max-width: 150px;',
    headerStyle: 'min-width: 100px; max-width: 150px;',
    classes: 'ellipsis',
  },
  {
    name: 'runMachine',
    label: 'Run Machine',
    field: 'RunMachine',
    sortable: false,
    align: 'left',
    style: 'min-width: 100px;; max-width: 150px;',
    headerStyle: 'min-width: 100px; max-width: 150px;',
    classes: 'ellipsis',
  },
  {
    name: 'buffers',
    label: 'Buffers',
    field: 'Buffers',
    sortable: false,
    align: 'left',
    style: 'min-width: 135px;',
    headerStyle: 'min-width: 135px',
    classes: 'ellipsis',
  },
]
export {
  allColumns,
}
