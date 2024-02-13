<template>
  <div>
    <RLabel :id="name" v-if="label" :error="!!errorMessage" :required="required">{{
      label
    }}</RLabel>
    <section class="relative" v-click-outside="handleOutsideClick">
      <!-- TOGGLE & SEARCH-->
      <div
        class="relative w-full h-[30px]"
        :class="{
          'h-[42px]': size === 'md'
        }"
      >
        <input
          type="text"
          class="w-full h-full p-2 text-sm text-gray-900 border-gray-300 rounded-md pr-9 bg-gray-50 placeholder:text-gray-500"
          :class="{
            'placeholder:text-gray-900': value?.label,

            'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 animate-shake-x':
              !!errorMessage,
            [inputClass]: inputClass
          }"
          :placeholder="value?.label || placeholder"
          @focus.stop="isOpen = true"
          v-model="searchTerm"
        />
        <div
          class="absolute right-[1px] flex items-center justify-center top-2 bottom-2 bg-gray-50 cursor-pointer"
          :class="{ 'bg-red-50': !!errorMessage }"
          @click.stop="isOpen = !isOpen"
        >
          <div class="h-full w-[1px] bg-gray-300" :class="{ '!bg-gray-400': isOpen }"></div>
          <span
            class="text-gray-300 transition-transform select-none material-symbols-rounded"
            :class="{
              'rotate-180 !text-gray-400 pt-[1px]': isOpen,
              'rotate-0': !isOpen,
              'px-1': size === 'md'
            }"
          >
            expand_more
          </span>
        </div>
      </div>

      <!-- MENU -->
      <div
        :class="{ hidden: !isOpen }"
        class="absolute z-10 w-full mt-0.5 overflow-hidden bg-white border border-gray-400 rounded-md top-full"
      >
        <!-- LIST -->
        <ul
          v-if="filteredOptions.length > 0"
          class="py-1 overflow-y-auto max-h-80"
          :class="[divider ? 'divide-y divide-gray-300' : '']"
        >
          <!-- ACTION BUTTON -->
          <li class="px-2 py-[10px] text-sm hover:bg-gray-50 gap-y-1" v-if="slots.actionButton">
            <slot name="actionButton"></slot>
          </li>
          <li
            v-for="option in filteredOptions"
            :key="option.value"
            class="px-1 py-[4px] text-sm cursor-pointer hover:bg-gray-50 flex flex-col gap-y-1"
            :class="{ 'bg-blue-100 hover:bg-blue-100': value?.value === option.value }"
            @click.stop="changeHandler(option)"
          >
            <div :class="optionLabelClass">
              <span>{{ option.label }}</span>
              <span class="font-normal ms-2" v-if="option.subLabel">{{
                `(${option.subLabel})`
              }}</span>
            </div>
            <div class="font-semibold" v-if="option.secondaryLabel">
              {{ option.secondaryLabel }}
            </div>
            <div v-if="option.helperLabel">{{ option.helperLabel }}</div>
          </li>
        </ul>
        <div
          class="px-2 py-[10px] text-sm cursor-pointer hover:bg-gray-50 gap-y-1"
          v-else-if="slots.newItem"
        >
          <slot name="newItem"></slot>
        </div>
        <p
          v-else-if="searchTerm.length > 0 && filteredOptions.length === 0"
          class="max-w-full p-2 overflow-hidden text-sm text-gray-600 text-ellipsis whitespace-nowrap"
        >
          No matching result for "{{ searchTerm }}"
        </p>
        <p v-else class="p-2 text-sm text-gray-500">No option found</p>
      </div>
    </section>
    <RInputFeedback v-if="errorMessage" type="error">
      {{ errorMessage }}
    </RInputFeedback>
    <RInputFeedback v-else-if="hint" type="hint">
      <span v-html="hint"></span>
    </RInputFeedback>
  </div>
</template>

<script lang="ts" setup>
import { type IOption } from '@/common/interfaces/option.interface'
import { useField } from 'vee-validate'
import { computed, ref, useSlots, watch, type HTMLAttributes } from 'vue'

export interface IProps {
  name: string
  label?: string
  placeholder?: string
  modelValue?: IOption<any>
  options: IOption<any>[]
  disabled?: boolean
  hint?: string
  required?: boolean
  optionLabelClass?: string
  inputClass?: HTMLAttributes['class']
  divider?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  required: false,
  divider: false,
  size: 'sm'
})
const emit = defineEmits<(event: 'update:modelValue', value: IOption<any> | undefined) => void>()
const slots = useSlots()

const isOpen = ref(false)
const searchTerm = ref('')

const { errorMessage, value, handleChange } = useField<IOption<any>>(() => props.name, undefined, {
  syncVModel: true
})

const changeHandler = (option: IOption<any>) => {
  // prevent selected item new click from triggering update function
  if (value?.value?.value === option?.value) {
    isOpen.value = false
    return
  }
  handleChange(option)
  emit('update:modelValue', option)
  isOpen.value = false
}

const handleOutsideClick = () => {
  if (isOpen.value) {
    isOpen.value = false
  }
}

const filteredOptions = computed(
  () =>
    (Array.isArray(props.options) &&
      props.options?.filter(
        (o) => o.label.toLowerCase().search(searchTerm.value.toLowerCase()) !== -1
      )) ||
    []
)

watch(isOpen, (isOpen) => {
  if (!isOpen) {
    searchTerm.value = ''
  }
})
</script>
