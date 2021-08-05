<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-10 col-lg-6">
        <div class="row">
          <div class="col">
            <q-input :readonly="readonly" v-model="importBlock" type="textarea" rows="20" />
          </div>
        </div>
        <div class="row reverse q-mt-md">
          <div>
            <q-btn outline label="Edit" color="primary" class="q-mr-sm" @click="readonly=false"/>
            <q-btn outline label="Save" color="primary" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: 'ImportBlock',
  components: {},
  setup() {
    const readonly = ref(true)
    const importBlock = ref('');
    return {
      readonly,
      importBlock,
    };
  },
});
</script>
