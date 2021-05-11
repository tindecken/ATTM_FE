<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Define Regression"
        icon="settings"
        :done="step > 1"
      >
        <define-regression></define-regression>
      </q-step>
      <q-step
        :name="2"
        title="Select Test Cases"
        caption="How many test cases need to run in the regression?"
        icon="create_new_folder"
        :done="step > 2"
      >
        <select-test-case></select-test-case>
      </q-step>
      <q-step
        :name="3"
        title="Add Regression Tests"
        caption="Convert selected test cases to Regression Tests"
        icon="create_new_folder"
        :done="step > 3"
      >
        <add-regression-test></add-regression-test>
      </q-step>
      <q-step
        :name="4"
        title="Build Project"
        caption="To check project is built success or not."
        icon="create_new_folder"
        :done="step > 4"
      >
        <build-project></build-project>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
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
    return {
      step: 1,
    }
  },
});
</script>
