<template>
  <div class="flex flex-col gap-3 mt-auto" v-if="totalItems">
    <p class="self-end">
      Showing 1 to {{ currentItemsCount }} of {{ totalItems }} entries
    </p>
    <BaseButton
      class="self-center w-min"
      v-if="totalItems > currentItemsCount"
      :loading="loading"
      @click="handleShowMore"
      >Show More</BaseButton
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue";
import BaseButton from "./BaseButton.vue";

interface IProps {
  totalItems?: number;
  itemsPerPage: number;
  currentItemsCount: number;
  onShowMore: () => Promise<void>;
}

const props = defineProps<IProps>();

const loading = ref(false);

const handleShowMore = async () => {
  loading.value = true;
  await props.onShowMore();
  loading.value = false;
};
</script>
