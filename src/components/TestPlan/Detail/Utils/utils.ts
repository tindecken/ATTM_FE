import { TestParamInterface } from '../../../../Models/TestParam';
import { computed } from 'vue';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { TestCaseInterface } from '../../../../Models/TestCase';
import { useTestCaseStore } from '../../../../pinia/testCaseStore';
import { isProxy, toRaw } from 'vue';

function getValueType(testParam: TestParamInterface): string {
  const globalStore = useGlobalStore();
  const isDark = computed(() => globalStore.darkTheme);
  if (testParam.TestNodePath) {
    if (isDark.value) {
      return 'testBedDark';
    }
    return 'testBed';
  }
  if (testParam.Value && testParam.Value.charAt(0) === '@' && testParam.Value.charAt(testParam.Value.length - 1) === '@') {
    if (isDark.value) {
      return 'testBufferDark';
    }
    return 'testBuffer';
  }
  return '';
}
async function isTestCaseModified(testCase: TestCaseInterface) {
  let rawTestCase;
  if (isProxy(testCase)) {
    rawTestCase = toRaw(testCase);
  } else {
    rawTestCase = testCase;
  }
  const testCaseStore = useTestCaseStore();
  // check if testcase is modified or not
  let isModified = false;
  // get testcase from database then verify with current one
  const originalTestCase = await testCaseStore.getTestCaseById(testCase.Id);
  console.log('originalTestCase', originalTestCase);
  console.log('rawTestCase', rawTestCase);

  if (originalTestCase.TestSteps.length !== rawTestCase.TestSteps.length) {
    isModified = true;
  } else {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < originalTestCase.TestSteps.length; i++) {
      if (originalTestCase.TestSteps[i].UUID !== rawTestCase.TestSteps[i].UUID) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].TestAUTId !== rawTestCase.TestSteps[i].TestAUTId) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].Keyword?.Name !== rawTestCase.TestSteps[i].Keyword?.Name) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].Description !== rawTestCase.TestSteps[i].Description) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].IsDisabled !== rawTestCase.TestSteps[i].IsDisabled) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].KWFeature !== rawTestCase.TestSteps[i].KWFeature) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].KWCategory !== rawTestCase.TestSteps[i].KWCategory) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].Params.length !== rawTestCase.TestSteps[i].Params.length) {
        isModified = true;
        break;
      }
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < originalTestCase.TestSteps[i].Params.length; j++) {
        if (originalTestCase.TestSteps[i].Params[j].Name !== rawTestCase.TestSteps[i].Params[j].Name) {
          isModified = true;
          break;
        }
        if (originalTestCase.TestSteps[i].Params[j].TestNodePath !== rawTestCase.TestSteps[i].Params[j].TestNodePath) {
          isModified = true;
          break;
        }
        if (
          originalTestCase.TestSteps[i].Params[j].TestNodePath === '' &&
          rawTestCase.TestSteps[i].Params[j].Value &&
          originalTestCase.TestSteps[i].Params[j].Value !== rawTestCase.TestSteps[i].Params[j].Value
        ) {
          isModified = true;
          break;
        }
      }
    }
  }
  return isModified;
}

export { getValueType, isTestCaseModified };
