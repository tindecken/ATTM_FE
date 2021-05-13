<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="currentStep"
      ref="stepper"
      color="primary"
      animated
      keep-alive
    >
      <q-step
        name="defineRegression"
        title="Define Regression"
        icon="settings"
      >
        <define-regression
          @validateForm="validateForm($event)"
        />
      </q-step>
      <q-step
        name="selectTestCase"
        title="Select Test Cases"
        caption="How many test cases need to run in the regression?"
        icon="create_new_folder"
      >
        <select-test-case></select-test-case>
      </q-step>
      <q-step
        name="buildProject"
        title="Build Project"
        caption="To check project is built success or not."
        icon="create_new_folder"
      >
        <build-project></build-project>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            class="q-mr-md"
            color="primary"
            :disable="!isStepValid"
            v-if="currentStep !== 'buildProject'"
            @click="$refs.stepper.next()"
            label="Continue"
          />
        <q-btn
          class="q-mr-md"
          color="primary"
          v-if="currentStep === 'buildProject'" 
          @click="finish()"
          label="Finish"
        />
        <q-btn
          v-if="currentStep !== 'defineRegression'"
          flat
          @click="$refs.stepper.previous()"
          label="Back"
        />
          <!-- <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" :disable="!isStepValid"/>
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" /> -->
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import AddRegressionTest from './AddRegressionTest.vue'
import DefineRegression from './DefineRegression.vue'
import SelectTestCase from './SelectTestCase.vue'
import BuildProject from './BuildProject.vue'

export default defineComponent({
  name: 'CreateRegression',
  components: {
    AddRegressionTest,
    DefineRegression,
    SelectTestCase,
    BuildProject,
  },
  setup(props, context) {
    const currentStep = ref('defineRegression')
    const isStepValid = ref(false)
    function validateForm(isValid: boolean) {
      console.log('isValid', isValid)
      isStepValid.value = isValid
    }
    return {
      currentStep,
      isStepValid,
      validateForm,
    }
  },
});
</script>
