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

export {
  paintCategories,
}
