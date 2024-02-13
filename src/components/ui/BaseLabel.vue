<template>
  <label
    :for="id"
    class="block mb-1 text-sm font-medium text-gray-900"
    :class="{ '!text-red-700': error }"
  >
    <slot />
    <span v-if="required" class="ml-1 text-red-600">*</span>
  </label>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
export interface IProps {
  id: string;
  error?: boolean;
  required?: boolean;
}

defineProps<IProps>();
</script>
