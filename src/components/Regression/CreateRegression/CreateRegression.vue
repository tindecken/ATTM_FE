<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="currentStep"
      ref="stepperRef"
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
        ></define-regression>
      </q-step>
      <q-step
        name="selectTestCase"
        title="Select Test Cases"
        caption="How many test cases need to run in the regression?"
        icon="create_new_folder"
      >
        <select-test-case
          @validateForm="validateForm($event)"
        ></select-test-case>
      </q-step>
      <q-step
        name="buildProject"
        title="Build Project"
        caption="Generate code, get latest code and try to build project"
        icon="create_new_folder"
      >
        <build-project></build-project>
      </q-step>
      <q-step
        name="createDBRecords"
        title="Setup in database"
        caption="Create Regression, RegressionTests"
        icon="create_new_folder"
      >
        <create-db></create-db>
      </q-step>
      <q-step
        name="deploySources"
        title="Deploy Source"
        caption="Copy built source to clients"
        icon="create_new_folder"
      >
        <deploy-source></deploy-source>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            class="q-mr-md"
            color="primary"
            :disable="!isStepValid"
            v-if="currentStep !== 'deploySources'"
            @click="$refs.stepperRef.next()"
            label="Continue"
          />
          <q-btn
            class="q-mr-md"
            color="primary"
            v-if="currentStep === 'deploySources'"
            @click="finish()"
            label="Finish"
          />
          <q-btn
            v-if="currentStep !== 'defineRegression'"
            flat
            @click="$refs.stepperRef.previous()"
            label="Back"
          />
        </q-stepper-navigation>
        {{currentStep}}
      </template>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import DeploySource from './DeploySource.vue'
import DefineRegression from './DefineRegression.vue'
import SelectTestCase from './SelectTestCase.vue'
import BuildProject from './BuildProject.vue'
import CreateDb from './CreateDB.vue'

export default defineComponent({
  name: 'CreateRegression',
  components: {
    DeploySource,
    DefineRegression,
    SelectTestCase,
    BuildProject,
    CreateDb,
  },
  setup() {
    useTitle('Create Regression');
    const $route = useRoute()
    const $router = useRouter()
    const stepperRef = ref(null)
    const currentStep = ref('defineRegression')
    const isStepValid = ref(false)
    function validateForm(isValid: boolean) {
      isStepValid.value = isValid
    }
    function finish() {
      // Go to regression page
      const redirectUrl = `/${$route.query.redirect || 'regression'}`;
      void $router.replace(redirectUrl);
    }
    return {
      currentStep,
      isStepValid,
      validateForm,
      stepperRef,
      finish,
    }
  },
});
</script>
