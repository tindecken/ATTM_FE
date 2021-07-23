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
            <q-toggle v-model="isOfficial" label="Is this regression official?" @input="validateForm()"/>
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
              @range-start="rangeStart($event)"
              @range-end="rangeEnd($event)"
              ref="datePicker"
            />
          </div>
        </div>
        </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  Ref,
  ref,
} from 'vue';
import { date } from 'quasar'
import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { useStore } from 'vuex'

export default defineComponent({
  name: 'DefineRegression',
  components: {},
  setup(props, context) {
    const $store = useStore()
    const datePicker: Ref<any> = ref(null)
    const name = ref('');
    const release = ref('');
    const build = ref('');
    const description = ref('');
    const isOfficial = ref(false);
    const form: Ref<any> = ref(null);
    const isFormValid = ref(false);
    const dateRange = reactive({ from: date.formatDate(Date.now(), 'YYYY/MM/DD'), to: date.formatDate(date.addToDate(Date.now(), { days: 7 }), 'YYYY/MM/DD') })
    const currentUser = computed(() => $store.getters['auth/userName'] as string)
    let defineRegressionObject: DefineRegressionInterface
    function validateForm() {
      form.value.validate().then((success: any) => {
        if (success) {
          if (dateRange != null) {
            defineRegressionObject = {
              Name: name.value,
              Release: release.value,
              Build: build.value,
              Description: description.value,
              IsOfficial: isOfficial.value,
              StartDate: dateRange.from,
              EndDate: dateRange.to,
              CreateBy: currentUser.value,
              RegressionTestIds: [],
            }
            context.emit('validateForm', true)
            $store.commit('createregression/setDefineRegression', defineRegressionObject)
          } else {
            context.emit('validateForm', false)
          }
        } else context.emit('validateForm', false)
      });
    }

    onMounted(() => $store.commit('createregression/setDefineRegression', null));

    function rangeStart(startDate: any) {
      dateRange.from = date.formatDate(date.buildDate({ year: startDate.year, month: startDate.month, date: startDate.day }, true), 'YYYY/MM/DD')
      validateForm()
    }

    function rangeEnd(endDate: any) {
      console.log('endDate From', endDate.from)
      console.log('endDate To', endDate.to)
      if (JSON.stringify(endDate.from) !== JSON.stringify(endDate.to)) {
        dateRange.from = date.formatDate(date.buildDate({ year: endDate.from.year, month: endDate.from.month, date: endDate.from.day }, true), 'YYYY/MM/DD')
        dateRange.to = date.formatDate(date.buildDate({ year: endDate.to.year, month: endDate.to.month, date: endDate.to.day }, true), 'YYYY/MM/DD')
        console.log('dateRange.from', dateRange.from)
        console.log('dateRange.to', dateRange.to)
        validateForm()
      } else {
        console.log('abc')
        context.emit('validateForm', false)
      }
    }
    return {
      form,
      name,
      release,
      build,
      description,
      validateForm,
      isOfficial,
      isFormValid,
      rangeStart,
      rangeEnd,
      datePicker,
      dateRange,
    };
  },
});
</script>
