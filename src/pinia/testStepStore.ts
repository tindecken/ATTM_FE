import { defineStore } from 'pinia'
import uuid from 'uuid-random';
import { TestStepInterface } from 'src/Models/TestStep'

export const useTestStepStore = defineStore('teststep', {
  state: () => ({
    copiedTestSteps: [] as TestStepInterface[],
  }),
  getters: {
  },
  actions: {
    setCopiedTestSteps(testSteps: TestStepInterface[]) {
      this.copiedTestSteps = testSteps.map((step: TestStepInterface) => ({ ...step, UUID: uuid() }))
    },
  },
})
