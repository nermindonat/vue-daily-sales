<template>
  <div :class="wrapperClass">
    <BaseLabel
      :id="name"
      v-if="label"
      :error="!!errorMessage"
      :required="required"
      >{{ label }}</BaseLabel
    >
    <div class="relative">
      <input
        :id="name"
        :name="name"
        :type="isVisible ? 'text' : type"
        class="block w-full p-2 h-[30px] text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        :class="{
          'pr-10': type === 'password',
          '!cursor-not-allowed !bg-gray-200': disabled,
          'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 animate-shake-x':
            !!errorMessage,
          [inputClass]: true,
          '!h-auto p-2.5': size === 'md',
        }"
        :placeholder="placeholder"
        v-model="value"
        :disabled="disabled"
        :autocomplete="autocomplete"
        v-on="listeners"
        :step="step"
      />
      <span
        v-if="type === 'password'"
        class="absolute text-gray-400 -translate-y-1/2 cursor-pointer select-none right-3 top-1/2 material-symbols-rounded"
        @click.stop="isVisible = !isVisible"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2rem"
          height="1.2rem"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m16.1 13.3l-1.45-1.45q.225-1.175-.675-2.2t-2.325-.8L10.2 7.4q.425-.2.863-.3T12 7q1.875 0 3.188 1.313T16.5 11.5q0 .5-.1.938t-.3.862m3.2 3.15l-1.45-1.4q.95-.725 1.688-1.587T20.8 11.5q-1.25-2.525-3.588-4.012T12 6q-.725 0-1.425.1T9.2 6.4L7.65 4.85q1.025-.425 2.1-.638T12 4q3.775 0 6.725 2.087T23 11.5q-.575 1.475-1.513 2.738T19.3 16.45m.5 6.15l-4.2-4.15q-.875.275-1.762.413T12 19q-3.775 0-6.725-2.087T1 11.5q.525-1.325 1.325-2.463T4.15 7L1.4 4.2l1.4-1.4l18.4 18.4zM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.588 4.013T12 17q.5 0 .975-.062t.975-.138l-.9-.95q-.275.075-.525.113T12 16q-1.875 0-3.188-1.312T7.5 11.5q0-.275.038-.525t.112-.525zm4.2 4.2"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseLabel from "./BaseLabel.vue";
import { useField } from "vee-validate";
import {
  defineProps,
  withDefaults,
  computed,
  ref,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "vue";

export interface IProps {
  label?: string;
  name: string;
  placeholder?: string;
  size?: "sm" | "md";
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color"
    | "file"
    | "image"
    | "range"
    | "textarea";
  disabled?: boolean;
  autocomplete?: InputHTMLAttributes["autocomplete"];
  modelValue?: string;
  step?: string;
  hint?: string;
  customEvents?: Record<string, (e: Event) => any>;
  validatingAsync?: boolean;
  errorMessage?: string;
  isValid?: boolean;
  required?: boolean;
  inputClass?: HTMLAttributes["class"];
  wrapperClass?: HTMLAttributes["class"];
  transformValue?: (value: InputEvent) => unknown;
}

const props = withDefaults(defineProps<IProps>(), {
  type: "text",
  size: "sm",
  disabled: false,
  validatingAsync: false,
});

const {
  errorMessage: vError,
  value,
  handleBlur,
  handleChange,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
const errorMessage = computed(() => props.errorMessage ?? vError.value);

const listeners = {
  ...props.customEvents,
  blur: (e: InputEvent) => {
    handleBlur(e, true);
    props.customEvents?.blur?.(e);
  },
  change: (e: InputEvent) => {
    handleChange(e);
    props.customEvents?.change?.(e);
  },
  input: (e: InputEvent) => {
    const value = props.transformValue ? props.transformValue(e) : e;
    handleChange(value, !!errorMessage.value);
    props.customEvents?.input?.(e);
  },
};

const isVisible = ref(false);
</script>
