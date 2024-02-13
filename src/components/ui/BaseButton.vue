<template>
  <button
    :type="type"
    class="font-medium rounded-lg text-sm px-4 py-2.5 whitespace-nowrap ml-0 flex justify-center items-center gap-1.5"
    :class="{
      '!bg-blue-400 !cursor-not-allowed': disabled || loading,
      'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300':
        variant === 'primary',
      'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200':
        variant === 'light',
      'text-blue-700 bg-blue-100 border border-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 ':
        variant === 'primary-outline',
    }"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <BaseSpinner v-if="loading" size="small" />
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import BaseSpinner from "./BaseSpinner.vue";
import { defineProps, withDefaults, defineEmits } from "vue";
export interface IProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "light" | "primary-outline";
}

withDefaults(defineProps<IProps>(), {
  type: "button",
  disabled: false,
  loading: false,
  variant: "primary",
});

defineEmits(["click"]);
</script>
