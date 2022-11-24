<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" fullHeight>
    <q-layout :class="isDark ? 'bg-grey-9' : 'bg-grey-3'" style="max-width: 1200px; min-height: 400px !important">
      <div class="row q-mb-sm">
        <div class="col-12">
          <q-bar>
            <q-icon name="edit" />
            <div>Update {{ RegressionTests.length }} Test(s)</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row" style="">
        <div class="col-1">
          <q-tabs
            v-model="selectedRegTestId"
            dense
            active-color="primary"
            align="left"
            vertical
            @update:model-value="changeRegressionTest(selectedRegTestId)"
            style="max-height: 465px; min-height: 370px"
          >
            <q-tab v-for="regTest in RegTests" :key="regTest.Id" :name="regTest.Id" :ripple="false">
              <div class="q-mr-xs">{{ regTest.TestCaseCodeName }}</div>
            </q-tab>
          </q-tabs>
        </div>
        <div class="col-11">
          <q-tab-panels v-model="selectedRegTestId" animated keep-alive>
            <q-tab-panel v-for="regTest in RegTests" :key="regTest.Id" :name="regTest.Id" style="max-height: 465px; min-height: 370px">
              <div class="row">
                <span class="text-subtitle2">{{ regTest.TestCaseName }}</span>
                <q-space />
                <q-btn
                  size="sm"
                  outline
                  icon="visibility"
                  primary
                  @click="showImage(regTest)"
                  class="q-mr-sm"
                  v-if="regTest.LastRegressionRunRecord?.ErrorScreenshot"
                  >View Screenshot</q-btn
                >
                <q-btn size="sm" outline icon="content_copy" primary @click="copy(regTest.TestCaseCodeName)" class="q-mr-sm">TestCase Code Name</q-btn>
                <q-btn size="sm" outline icon="content_copy" primary @click="copy(regTest.TestCaseName)" class="q-mr-sm">TestCase Name</q-btn>
                <q-btn size="sm" outline icon="content_copy" primary @click="copy(regTest.LastRegressionRunRecord?.Log || '')">Log</q-btn>
              </div>
              <q-separator class="q-mb-sm q-mt-sm"></q-separator>
              <div class="row">
                {{ regTest.LastRegressionRunRecord?.Log }}
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm"></q-separator>
      <div class="row justify-center q-gutter-md">
        <div class="col-3">
          <q-bar class="justify-center">
            <q-icon name="play_arrow" />
            <div>Rerun</div>
          </q-bar>
          <div class="q-mt-sm">
            <q-select
              dense
              v-model="selectedClient"
              @update:model-value="onChangeClient($event)"
              :options="clients"
              option-label="Name"
              label="Run on specific client or blank for any client"
              input-debounce="0"
              use-input
              fill-input
              hide-selected
              options-dense
              clearable
              class="row"
            />
            <q-checkbox v-model="isHighPriority" label="Is Highpriority?" />
            <div class="row justify-end q-mt-sm">
              <q-btn outline @click="run()">Run</q-btn>
            </div>
          </div>
        </div>
        <div class="col-3">
          <q-bar class="justify-center">
            <q-icon name="edit" />
            <div>Analyse</div>
          </q-bar>
          <div class="q-mt-sm">
            <q-select
              dense
              v-model="selectedAnalyseStatus"
              :options="analyseStatuses"
              option-label="Name"
              label="Status"
              input-debounce="0"
              use-input
              fill-input
              hide-selected
              options-dense
            />
            <q-input label="Reason" outlined dense type="textarea" rows="2" v-model="reason" class="q-mt-sm" />
            <q-input
              label="IssueID: Issue Description"
              outlined
              dense
              type="textarea"
              rows="2"
              v-model="issue"
              :readonly="selectedAnalyseStatus !== 'AnalyseFailed' && selectedAnalyseStatus !== 'InCompatible'"
              class="q-mt-sm"
            />
            <q-input label="Analyse by" outlined dense readonly class="q-mt-sm" :modelValue="userName" />
            <div class="row justify-end q-mt-sm">
              <q-btn outline @click="setAnalyseStatus()">Save</q-btn>
            </div>
          </div>
        </div>
        <div class="col-5">
          <q-bar class="justify-center">
            <q-icon name="comment" />
            <div>Histories & Comments</div>
          </q-bar>
          <div class="q-mt-sm">
            <q-input outlined dense type="textarea" rows="10" :modelValue="selectedRegTest?.Comments" class="q-mt-sm" readonly />
            <q-input label="add your comment/note" outlined dense type="textarea" rows="2" v-model="commentInput" class="q-mt-sm" />
            <div class="row justify-end q-mt-sm">
              <q-btn outline @click="addCommentForAll()" :label="`Comment all (${RegressionTests.length})`">
                <q-tooltip style="font-size: small">Add Comment for all {{ RegressionTests.length }} tests. This can't be undo</q-tooltip>
              </q-btn>
              <q-btn outline @click="addCommentForOne()" class="q-ml-sm" label="Comment one">
                <q-tooltip style="font-size: small">Add Comment for the selected test ({{ selectedRegTest?.TestCaseCodeName }}). This can't be undo</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, PropType, onMounted } from 'vue';
import { useQuasar, useDialogPluginComponent } from 'quasar';
import { useClipboard } from '@vueuse/core';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { useTestClientStore } from '../../../../pinia/testClientStore';
import { useRegressionStore } from '../../../../pinia/regressionStore';
import { useRegMonitoringStore } from '../../../../pinia/regMonitoring';
import _ from 'lodash';
import { RegressionTestInterface } from '../../../../Models/RegressionTest';
import { TestClientInterface } from '../../../../Models/TestClient';
import { AddCommentDataInterface } from '../../../../Models/Entities/AddCommentData';
import { SetRegressionQueueDataInterface } from '../../../../Models/Entities/SetRegressionQueueData';
import { SetRegressionAnalyseStatusDataInterface } from '../../../../Models/Entities/SetRegressionAnalyseStatusData';
import { useUserStore } from '../../../../pinia/userStore';
import config from '../../../../config';

export default defineComponent({
  name: 'UpdateDialog',
  props: {
    RegressionTests: {
      type: Object as PropType<RegressionTestInterface[]>,
      required: true,
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {},
  setup(props) {
    const globalStore = useGlobalStore();
    const userStore = useUserStore();
    const testClientStore = useTestClientStore();
    const regressionStore = useRegressionStore();
    const regMonitoringStore = useRegMonitoringStore();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    const { copy } = useClipboard();
    const $q = useQuasar();
    const description = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => globalStore.darkTheme);
    const userName = computed(() => userStore.Username);
    const clients: Ref<TestClientInterface[]> = computed(() => testClientStore.testClients);
    const selectedClient: Ref<TestClientInterface | null> = ref(null);
    const selectedRegTest: Ref<RegressionTestInterface | null> = ref(null);
    const RegTests: Ref<RegressionTestInterface[]> = ref([]);
    const isFormValid = ref(false);
    const form: Ref<any> = ref(null);
    const selectedRegTestId = ref('');
    const selectedAnalyseStatus = ref('');
    const commentInput = ref('');
    const isHighPriority = ref(false);
    const reason = ref('');
    const issue = ref('');
    onMounted(() => {
      RegTests.value = _.cloneDeep(props.RegressionTests);
      if (RegTests.value.length > 0) {
        selectedRegTestId.value = RegTests.value[0].Id;
        // eslint-disable-next-line prefer-destructuring
        selectedRegTest.value = RegTests.value[0];
      }
    });
    function onOKClick() {
      onDialogOK(description.value);
    }
    function onChangeClient(value: TestClientInterface) {
      console.log('value', value);
      selectedClient.value = value;
      console.log('selectedClient.value', selectedClient.value);
    }

    function validateForm() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (form.value !== null) form.value.validate(false);
    }
    async function showImage(regTest: RegressionTestInterface) {
      const image = await regMonitoringStore.getScreenshot(regTest.LastRegressionRunRecord?.ErrorScreenshot);
      const contentType = 'image/png';
      const byteCharacters = atob(image.substr(`data:${contentType};base64,`.length));
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += config.screenHeight) {
        const slice = byteCharacters.slice(offset, offset + config.screenHeight);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i += 1) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
    }
    function changeRegressionTest(regressionTestId: string) {
      const index = RegTests.value.findIndex((regTest: RegressionTestInterface) => regTest.Id === regressionTestId);
      if (index >= 0) {
        selectedRegTest.value = RegTests.value[index];
        console.log('selectedRegTest', selectedRegTest.value);
      }
    }
    function addCommentForAll() {
      if (commentInput.value === '') return;
      const regressionTestIds: string[] = [];
      RegTests.value.forEach((regTest: RegressionTestInterface) => {
        regressionTestIds.push(regTest.Id);
      });
      const commentData: AddCommentDataInterface = {
        RegressionTestIds: regressionTestIds,
        CommentBy: userName.value,
        Comment: commentInput.value,
      };
      const updateComment: Promise<any> = regressionStore.addCommentForRegressionTests(commentData);
      void updateComment
        .then((r) => {
          console.log('updateComment', r);
          RegTests.value.forEach((regTest: RegressionTestInterface) => {
            r.data.data.forEach((rt: RegressionTestInterface) => {
              if (rt.Id === regTest.Id) {
                regTest.Comments = rt.Comments;
              }
            });
          });
          commentInput.value = '';
          $q.notify({
            type: 'positive',
            message: `${r.data.message}`,
          });
        })
        .catch((e) => {
          $q.notify({
            type: 'negative',
            message: `${e}`,
          });
        });
    }
    function addCommentForOne() {
      if (commentInput.value === '' || selectedRegTest.value === null) return;
      const commentData: AddCommentDataInterface = {
        RegressionTestIds: [selectedRegTest.value.Id],
        CommentBy: userName.value,
        Comment: commentInput.value,
      };
      const updateComment: Promise<any> = regressionStore.addCommentForRegressionTests(commentData);
      void updateComment
        .then((r) => {
          console.log('updateComment', r);
          if (selectedRegTest.value !== null) {
            const index = RegTests.value.findIndex((regTest: RegressionTestInterface) => regTest.Id === selectedRegTest.value?.Id);
            if (index >= 0) {
              RegTests.value[index].Comments = r.data.data[0].Comments;
            }
          }
          commentInput.value = '';
          $q.notify({
            type: 'positive',
            message: `${r.data.message}`,
          });
        })
        .catch((e) => {
          $q.notify({
            type: 'negative',
            message: `${e}`,
          });
        });
    }
    function run() {
      const regressionTestIds: string[] = [];
      RegTests.value.forEach((regTest: RegressionTestInterface) => {
        regressionTestIds.push(regTest.Id);
      });
      const regressionQueueData: SetRegressionQueueDataInterface = {
        RegressionTestIds: regressionTestIds,
        ClientName: selectedClient.value ? selectedClient.value.Name : '',
        IsHighPriority: isHighPriority.value,
        UpdateBy: userName.value,
      };
      const setQueueResult: Promise<any> = regressionStore.setRegressionQueue(regressionQueueData);
      void setQueueResult
        .then((r: any) => {
          console.log('setQueueResult', r);
          RegTests.value.forEach((regTest: RegressionTestInterface) => {
            r.data.data.forEach((rt: RegressionTestInterface) => {
              if (rt.Id === regTest.Id) {
                regTest.Comments = rt.Comments;
              }
            });
          });
          $q.notify({
            type: 'positive',
            message: `${r.data.message}`,
          });
        })
        .catch((e) => {
          $q.notify({
            type: 'negative',
            message: `${e}`,
          });
        });
    }
    function setAnalyseStatus() {
      // Check the conditions before save
      switch (selectedAnalyseStatus.value) {
        case '':
          $q.notify({
            type: 'warning',
            message: "Status can't be empty",
          });
          return;
        case 'AnalysePassed':
          if (reason.value === '') {
            $q.notify({
              type: 'warning',
              message: 'Reason is required when status is AnalysePassed',
            });
            return;
          }
          break;
        case 'AnalyseFailed':
          if (issue.value === '') {
            $q.notify({
              type: 'warning',
              message: 'Issue is required when status is AnalyseFailed',
            });
            return;
          }
          break;
        case 'InCompatible':
          if (reason.value === '' && issue.value === '') {
            $q.notify({
              type: 'warning',
              message: 'At least reason or issue is required when status is InCompatible',
            });
            return;
          }
          break;
        default:
          break;
      }
      const regressionTestIds: string[] = [];
      RegTests.value.forEach((regTest: RegressionTestInterface) => {
        regressionTestIds.push(regTest.Id);
      });
      const regressionAnalyStatusData: SetRegressionAnalyseStatusDataInterface = {
        RegressionTestIds: regressionTestIds,
        Status: selectedAnalyseStatus.value,
        AnalyseBy: userName.value,
        Reason: reason.value,
        Issue: issue.value,
      };
      const setRegressionStatusResult: Promise<any> = regressionStore.setRegressionAnalyseStatus(regressionAnalyStatusData);
      void setRegressionStatusResult
        .then((r: any) => {
          reason.value = '';
          issue.value = '';
          RegTests.value.forEach((regTest: RegressionTestInterface) => {
            r.data.data.forEach((rt: RegressionTestInterface) => {
              if (rt.Id === regTest.Id) {
                regTest.Comments = rt.Comments;
              }
            });
          });
          $q.notify({
            type: 'positive',
            message: `${r.data.message}`,
          });
        })
        .catch((e) => {
          $q.notify({
            type: 'negative',
            message: `${e}`,
          });
        });
    }
    return {
      setAnalyseStatus,
      reason,
      run,
      isHighPriority,
      RegTests,
      addCommentForAll,
      addCommentForOne,
      commentInput,
      userName,
      changeRegressionTest,
      issue,
      selectedAnalyseStatus,
      analyseStatuses: ['AnalysePassed', 'AnalyseFailed', 'InCompatible'],
      onChangeClient,
      selectedRegTest,
      selectedClient,
      clients,
      showImage,
      copy,
      selectedRegTestId,
      dialogRef,
      onDialogHide,
      onOKClick,
      isDark,
      description,
      isFormValid,
      validateForm,
      form,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
