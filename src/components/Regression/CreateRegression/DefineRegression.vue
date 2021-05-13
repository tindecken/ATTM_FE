<template>
  <div class="q-pa-md">
    <q-form
      greedy
      ref="form"
      class="q-gutter-md"
      style="max-width: 800px;"
      @validation-success="isFormValid = true"
      @validation-error="isFormValid = false"
    >
      <div class="flex row space-between">
        <div class="col-4">
          <div class="row">
            <q-input
              no-error-icon
              outlined
              dense
              autofocus
              v-model="name"
              @blur="validateForm()"
              label="Regression Name *"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Provide regression name'
              ]"
              class="q-mb-sm"
            />
          </div>
          <div class="row">
            <q-input
              outlined
              no-error-icon
              dense
              v-model="release"
              label="Release Name *"
              @blur="validateForm()"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Provide Release Name'
              ]"
            />
          </div>
          <div class="row q-mb-sm">
            <q-input outlined dense v-model="build" label="Build Name"
            :rules="[
                val => val.length < 25 || 'Build Name maximum is 25 chars'
              ]"
            />
          </div>
          <div class="row">
            <q-input
              label="Description"
              outlined
              dense
              type="textarea"
              rows="8"
              v-model="description"
              @blur="validateForm()"
              :rules="[
                val => val.length < 500 || 'Description maximum is 500 chars'
              ]"
            />
          </div>
          <div class="row q-mb-md">
            <q-toggle v-model="isOfficial" label="Is this regression official?" />
          </div>
        </div>
        <div class="col">
          <div class="row q-mb-md">
            <span>Select start and end date of the regression</span>
          </div>
          <div class="row">
            <q-date
              v-model="dateRange"
              range
              today-btn
              @input="validateForm()"
            />
          </div>
        </div>
        </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import { date } from 'quasar'

export default defineComponent({
  name: 'DefineRegression',
  components: {},
  setup(props, context) {
    const name = ref('');
    const release = ref('');
    const build = ref('');
    const description = ref('');
    const isOfficial = ref(false);
    const form: Ref<any> = ref(null);
    const isFormValid = ref(false);
    const dateRange = ref({ from: date.formatDate(Date.now(), 'YYYY/MM/DD'), to: date.formatDate(date.addToDate(Date.now(), { days: 7 }), 'YYYY/MM/DD') })
    function validateForm() {
      form.value.validate().then((success: any) => {
        if (success) {
          if (dateRange.value != null) context.emit('validateForm', true)
          else context.emit('validateForm', false)
        } else context.emit('validateForm', false)
      });
    }
    return {
      form,
      name,
      release,
      build,
      description,
      validateForm,
      isOfficial,
      dateRange,
      isFormValid,
    };
  },
});
</script>
