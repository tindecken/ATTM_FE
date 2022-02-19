import { TestParamInterface } from 'src/Models/TestParam';
import { computed } from 'vue'
import { useGlobalStore } from 'src/pinia/globalStore';

function getValueType(testParam: TestParamInterface): string {
  const globalStore = useGlobalStore()
  const isDark = computed(() => globalStore.darkTheme);
  if (testParam.TestNodePath) {
    if (isDark.value) {
      return 'testBedDark'
    }
    return 'testBed'
  }
  if (testParam.Value && testParam.Value.charAt(0) === '@' && testParam.Value.charAt(testParam.Value.length - 1) === '@') {
    if (isDark.value) {
      return 'testBufferDark'
    }
    return 'testBuffer'
  }
  return ''
}

export { getValueType }
