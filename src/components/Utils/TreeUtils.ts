import { CategoryInterface } from 'src/Models/Category';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { TestSuiteInterface } from 'src/Models/TestSuite';

function paintCategories(cats: CategoryInterface[]): CategoryInterface[] {
  return cats.map((cat) => {
    cat.nodeKey = cat.Id
    cat.label = cat.Name
    cat.icon = 'folder_open'
    cat.nodeType = 'Category'
    cat.children.forEach((ts: TestSuiteInterface) => {
      ts.nodeKey = ts.Id
      ts.label = `${ts.CodeName}: ${ts.Name}`
      ts.icon = 'reorder'
      ts.nodeType = 'TestSuite'
      ts.children.forEach((tg: TestGroupInterface) => {
        tg.nodeKey = tg.Id
        tg.label = `${tg.CodeName}: ${tg.Name}`
        tg.icon = 'grid_view'
        tg.nodeType = 'TestGroup'
        tg.children.forEach((tc: TestCaseInterface) => {
          tc.nodeKey = tc.Id
          tc.label = `${tc.CodeName}: ${tc.Name}`
          tc.icon = 'list_alt'
          tc.nodeType = 'TestCase'
        })
      })
    })
    return { ...cat }
  })
}

function paintTestSuite(testSuite: TestSuiteInterface): TestSuiteInterface {
  testSuite.nodeKey = testSuite.Id
  testSuite.label = `${testSuite.CodeName}: ${testSuite.Name}`
  testSuite.icon = 'reorder'
  testSuite.nodeType = 'TestSuite'
  return { ...testSuite }
}

function paintTestGroup(testGroup: TestGroupInterface): TestGroupInterface {
  testGroup.nodeKey = testGroup.Id
  testGroup.label = `${testGroup.CodeName}: ${testGroup.Name}`
  testGroup.icon = 'grid_view'
  testGroup.nodeType = 'TestGroup'
  return { ...testGroup }
}

function paintTestCase(testCase: TestCaseInterface): TestCaseInterface {
  testCase.nodeKey = testCase.Id
  testCase.label = `${testCase.CodeName}: ${testCase.Name}`
  testCase.icon = 'list_alt'
  testCase.nodeType = 'TestCase'
  return { ...testCase }
}

export {
  paintCategories,
  paintTestSuite,
  paintTestGroup,
  paintTestCase,
}
