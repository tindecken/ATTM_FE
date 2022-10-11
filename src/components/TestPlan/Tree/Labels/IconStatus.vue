<template>
  <template v-if="Node.nodeType === 'TestCase'">
    <q-icon :name="Node.icon" class="q-mr-sm self-center" :color="(Node as TestCaseInterface).iconColor">
      <q-tooltip v-if="(props.Node as TestCaseInterface).iconTooltip" class="bg-amber-1 text-black">
        <div style="font-size: small">
          <span :class="`text-${Node.iconColor}`" style="font-size: 14px">Last Regression Run</span><br />
          <span>Status: {{ (props.Node as TestCaseInterface).iconTooltip.Status}}<br /></span>
          <span>Release: {{ (props.Node as TestCaseInterface).iconTooltip.Regression}}<br /></span>
          <span>Build: {{ (props.Node as TestCaseInterface).iconTooltip.Build}}<br /></span>
          <span v-if="(props.Node as TestCaseInterface).iconTooltip.Issue">Issue: {{ (props.Node as TestCaseInterface).iconTooltip.Issue}}<br /></span>
        </div>
      </q-tooltip>
    </q-icon>
  </template>
  <template v-else>
    <q-icon :name="Node.icon" class="q-mr-sm self-center" />
  </template>
</template>

<script setup lang="ts">
import type { CategoryInterface } from '../../../../Models/Category';
import type { TestCaseInterface } from '../../../../Models/TestCase';
import type { TestGroupInterface } from '../../../../Models/TestGroup';
import type { TestSuiteInterface } from '../../../../Models/TestSuite';

const props = defineProps<{
  Node: TestCaseInterface | TestGroupInterface | TestSuiteInterface | CategoryInterface;
}>();
</script>

<style scoped lang="scss"></style>
