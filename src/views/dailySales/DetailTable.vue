<template>
  <div class="h-full m-4 border border-gray-200 rounded-sm p-3">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">SKU</th>
          <th scope="col" class="px-6 py-3">Product Name</th>
          <th scope="col" class="px-6 py-3">
            <span class="block text-right">Saturday</span>
            <span class="block text-right">{{
              moment(props.detailTableData.selectedDate).format("DD-MM-YYYY")
            }}</span>
            <span class="block !w-40 text-right">Sales / Units</span>
            <span class="block text-right">Avg. Selling Price</span>
          </th>

          <th scope="col" class="px-6 py-3">
            <span class="block text-right">Monday</span>
            <span class="block text-right">{{
              props.detailTableData.selectedDate2 &&
              moment(props.detailTableData.selectedDate2).isValid()
                ? moment(props.detailTableData.selectedDate2).format(
                    "DD-MM-YYYY"
                  )
                : ""
            }}</span>
            <span class="block !w-40 text-right">Sales / Units</span>
            <span class="block text-right">Avg. Selling Price</span>
          </th>
          <th scope="col" class="!w-36 px-6 py-3">Sku Refund Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) in props.filteredData"
          :key="idx"
          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
        >
          <td class="px-6 py-4">{{ item?.sku }}</td>
          <td class="px-6 py-4">{{ item?.productName }}</td>
          <td
            class="px-6 py-4 items-center text-[#2CAFFE] font-bold text-right"
          >
            <div>
              <span>${{ item.amount }} / {{ item.qty }}</span>
            </div>

            <div class="ml-4 text-right">
              <span>C$ {{ (item?.amount / item?.qty).toFixed(2) }}</span>
            </div>
          </td>
          <td
            class="px-6 py-4 items-center text-[#00E272] font-bold text-right"
          >
            <div>
              <span>${{ item.amount2 }} / {{ item.qty2 }}</span>
            </div>
            <div class="ml-4">
              <span
                >C$
                {{
                  item?.amount2 !== null &&
                  item?.qty2 !== null &&
                  item?.amount2 !== undefined &&
                  item?.qty2 !== undefined &&
                  item?.qty2 !== 0
                    ? (item?.amount2 / item?.qty2).toFixed(2)
                    : 0
                }}</span
              >
            </div>
          </td>
          <td class="px-6 py-4 text-right">{{ item?.amount }}</td>
        </tr>
      </tbody>
    </table>
    <nav
      class="flex items-center flex-column flex-wrap md:flex-row justify-end pt-4"
      aria-label="Table navigation"
    >
      <ul
        class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 justify-end"
      >
        <li>
          <a
            @click="$emit('prevPage')"
            href="#"
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span class="sr-only">Previous</span>
            <svg
              class="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            {{ pageNumber }}
          </a>
        </li>
        <li>
          <a
            @click="$emit('nextPage')"
            href="#"
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span class="sr-only">Next</span>
            <svg
              class="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { defineProps, defineEmits } from "vue";

interface IProps {
  detailTableData: string[];
  refundRateData: string[];
  filteredData: string[];
  pageNumber: number;
}
const props = defineProps<IProps>();

interface IEmits {
  (event: "prevPage"): void;
  (event: "nextPage"): void;
}

const emit = defineEmits<IEmits>();
</script>
