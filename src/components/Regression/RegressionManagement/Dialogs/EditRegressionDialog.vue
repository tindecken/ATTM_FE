<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 800px; min-height: 100px !important; min-width: 350px; max-width: 350px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Edit Regression: {{ props.Regression.Name }}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="q-pa-sm">
        <q-form @submit="onOKClick" greedy @validation-success="isFormValid = true" @validation-error="isFormValid = false" ref="form" class="q-mt-sm">
          <div class="row">
            <div class="col">
              <q-input
                label="Name"
                outlined
                dense
                autofocus
                :model-value="editRegression?.Name"
                @update:model-value="
                  (value: string) =>
                    editRegression ? (editRegression.Name = value) : ''
                "
                @blur="validateForm()"
                :rules="[(val) => !!val || '* Required']"
                lazy-rules
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input
                label="Build"
                outlined
                dense
                :model-value="editRegression?.Build"
                @update:model-value="(value: string) => (editRegression ? (editRegression.Build = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => !!val || '* Required', (val) => val.length < 50 || 'Maximum is 50 chars']"
                lazy-rules
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col">
              <q-toggle
                :model-value="editRegression?.IsOfficial"
                label="Is official?"
                @update:model-value="(value: boolean) => (editRegression ? (editRegression.IsOfficial = value) : '')"
              />
            </div>
            <div class="col">
              <q-input
                label="Last Update By"
                outlined
                dense
                :model-value="userStore.Username"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'Author maximum is 50 chars']"
                :readonly="true"
              />
            </div>
          </div>
          <div class="row justify-center">
            Start Date - End Date
            <q-date v-model="dateRange" range today-btn />
          </div>
          <div class="row q-mt-sm">
            <div class="col">
              <q-input
                label="Description"
                outlined
                dense
                type="textarea"
                rows="3"
                :model-value="editRegression?.Description"
                @update:model-value="(value: string) => (editRegression ? (editRegression.Description = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => val.length < 500 || 'Description maximum is 500 chars']"
              />
            </div>
          </div>
          <div class="column items-end q-mt-md">
            <div class="col">
              <q-btn flat label="Cancel" @click="onDialogCancel()" v-close-popup class="q-mr-sm" />
              <q-btn outline label="Update" :disable="!isFormValid" type="submit" color="primary" />
            </div>
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, Ref } from 'vue';
import _ from 'lodash';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { QForm, useDialogPluginComponent, date } from 'quasar';
import { RegressionInterface } from '../../../../Models/Regression';
import { useUserStore } from '../../../../pinia/userStore';

const props = defineProps<{
  Regression: RegressionInterface;
}>();

const emits = defineEmits([...useDialogPluginComponent.emits]);

const globalStore = useGlobalStore();
const userStore = useUserStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const isDark = computed(() => globalStore.darkTheme);
const isFormValid = ref(false);
const form = ref(QForm);
const editRegression: Ref<RegressionInterface | null> = ref(null);
const dateRange = ref({
  from: null,
  to: null,
});
onMounted(() => {
  editRegression.value = _.cloneDeep(props.Regression);
  dateRange.value = {
    from: date.formatDate(editRegression?.value.StartDate, 'YYYY/MM/DD'),
    to: date.formatDate(editRegression?.value.EndDate, 'YYYY/MM/DD'),
  };
  console.log('editRegression', editRegression.value);
});
function onOKClick() {
  editRegression.value.StartDate = dateRange.value.from;
  editRegression.value.EndDate = dateRange.value.to;
  editRegression.value.LastUpdatedBy = userStore.Username;
  onDialogOK(editRegression.value);
}

function validateForm() {
  if (form.value !== null) form.value.validate(false);
}
</script>
