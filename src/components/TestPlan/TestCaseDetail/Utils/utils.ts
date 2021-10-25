import { TestParamInterface } from 'src/Models/TestParam';
import { computed } from 'vue'
import { useStore } from 'vuex'

const isDark = computed(() => useStore().getters['global/darkTheme'] as boolean);

function getValueType(testParam: TestParamInterface): string {
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
