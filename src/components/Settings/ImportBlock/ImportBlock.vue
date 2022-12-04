<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-10 col-lg-6">
        <div class="row">
          <div class="col">
            <q-input :readonly="readonly" v-model="importBlockSetting.Value" type="textarea" rows="20" />
          </div>
        </div>
        <div class="row reverse q-mt-md">
          <div>
            <q-btn outline label="Edit" color="primary" class="q-mr-sm" @click="readonly = false" />
            <q-btn outline label="Save" color="primary" @click="updateImportBlock()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '../../../pinia/userStore';
import { useSettingStore } from '../../../pinia/settingStore';
import { SettingInterface } from '../../../Models/Setting';

export default defineComponent({
  name: 'ImportBlock',
  components: {},
  props: {
    importBlock: {
      type: Object as PropType<SettingInterface>,
      required: true,
      default: () => ({}),
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const settingStore = useSettingStore();
    const $q = useQuasar();
    const readonly = ref(true);
    const importBlockSetting: Ref<SettingInterface> = computed(() => props.importBlock);
    async function updateImportBlock() {
      try {
        const newSetting: SettingInterface = {
          Id: importBlockSetting.value.Id,
          Name: 'ImportBlock',
          Value: importBlockSetting.value.Value,
          IsDeleted: importBlockSetting.value.IsDeleted,
          Description: importBlockSetting.value.Description,
          UpdatedDateTime: new Date(),
          UpdatedBy: userStore.Username,
        };
        const result = await settingStore.updateSetting({
          settingId: importBlockSetting.value.Id,
          setting: newSetting,
        });
        $q.notify({
          type: 'positive',
          message: `${result.message}`,
        });
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }
    return {
      readonly,
      updateImportBlock,
      importBlockSetting,
    };
  },
});
</script>
