<template>
  <div class="w-full h-full">
    <div class="chart-container relative">
      <div ref="chartContainer" class="h-full m-4 py-1 border border-gray-400">
        <h2 class="h-[40px] text-gray-900 font-bold text-sm pl-2 mt-3">
          Please select the day range!
        </h2>
      </div>
      <div class="absolute top-0 right-0 mr-6 mt-2">
        <select
          v-model="selectedDays"
          id="days-range"
          class="text-gray-900 font-bold text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="60">Last 60 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="7">Last 7 Days</option>
        </select>
      </div>
      <div
        v-if="pageLoading"
        class="flex justify-center items-center h-full w-full absolute top-0 left-0 bg-white bg-opacity-75 z-50"
      >
        <Spinner />
      </div>
    </div>

    <DetailTable
      v-if="showDetailTable"
      :detailTableData="detailTableData"
      :refundRateData="refundRateData"
      :filteredData="filteredData"
      :pageNumber="pageNumber"
      @prevPage="prevPage"
      @nextPage="nextPage"
    />
  </div>
</template>
<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import Highcharts from "highcharts";
import { useStore } from "vuex";
import DetailTable from "./DetailTable.vue";
import Spinner from "@/components/ui/BaseSpinner.vue";
const chartContainer = ref<HTMLDivElement | null>(null);
const store = useStore();
const accessToken = store.getters.getAccessToken;
const detailTableData = ref<[]>([]);
const refundRateData = ref<[]>([]);
const pageLoading = ref(true);
const showDetailTable = ref(false);
const firstDate = ref<string>("");
const secondDate = ref<string>("");
let clickCount = 0;
const pageNumber = ref<number>(1);
const selectedDays = ref<number>(30);
const currency = ref(undefined);
const filteredData = ref([]);

const fetchData = async (
  marketplaceName: string,
  storeId: string,
  selectedDays: number
) => {
  try {
    pageLoading.value = true;
    const response = await axios.post(
      `${process.env.VUE_APP_BASE_URL}data/daily-sales-overview/`,
      {
        customDateData: null,
        day: parseInt(selectedDays),
        excludeYoYData: true,
        marketplace: marketplaceName,
        requestStatus: 0,
        sellerId: storeId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    pageLoading.value = false;
    currency.value = response.data.Data.Currency;
    return response.data.Data.item;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchDetailData = async (
  marketplaceName: string,
  storeId: string,
  firstDate: string
) => {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_BASE_URL}data/daily-sales-sku-list/`,
      {
        marketplace: marketplaceName,
        sellerId: storeId,
        salesDate: firstDate,
        salesDate2: secondDate.value,
        pageSize: 10,
        pageNumber: pageNumber.value,
        isDaysCompare: clickCount,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    detailTableData.value = response.data.Data.item;
    const skuList = detailTableData.value.skuList;
    await fetchRefundRateData(marketplaceName, storeId, skuList);
  } catch (error: any) {
    throw new Error(error);
  }
};

const fetchRefundRateData = async (
  marketplaceName: string,
  storeId: string,
  skuList: Array<string>
) => {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_BASE_URL}data/get-sku-refund-rate/`,
      {
        marketplace: marketplaceName,
        sellerId: storeId,
        skuList: skuList,
        requestedDay: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    refundRateData.value = response.data.Data;
    filteredData.value = refundRateData.value.map((item) => item.sku);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const prevPage = async () => {
  const userInfoResponse = store.getters.currentUser;
  const storeId = userInfoResponse?.Data?.user?.store[0]?.storeId;
  const marketplaceName =
    userInfoResponse?.Data?.user?.store[0]?.marketplaceName;
  console.log(marketplaceName, storeId, firstDate.value, secondDate.value);
  if (pageNumber.value > 1) {
    pageNumber.value--;
    if (marketplaceName && storeId && firstDate) {
      await fetchDetailData(marketplaceName, storeId, firstDate.value);
    }
  }
};

const nextPage = async () => {
  const userInfoResponse = store.getters.currentUser;
  const storeId = userInfoResponse?.Data?.user?.store[0]?.storeId;
  const marketplaceName =
    userInfoResponse?.Data?.user?.store[0]?.marketplaceName;

  console.log(marketplaceName, storeId, firstDate.value, secondDate.value);
  pageNumber.value++;
  if (marketplaceName && storeId && firstDate) {
    await fetchDetailData(marketplaceName, storeId, firstDate.value);
  }
};

function getDayByDate(date: string) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date(date);
  const dayNumber = d.getDay();
  return weekday[dayNumber];
}

onMounted(async () => {
  const userInfoResponse = store.getters.currentUser;
  const storeId = userInfoResponse?.Data?.user?.store[0]?.storeId;
  const marketplaceName =
    userInfoResponse?.Data?.user?.store[0]?.marketplaceName;

  if (!storeId || !marketplaceName) {
    console.error("storeId or marketplaceName is missing in userInfoResponse");
    return;
  }

  await fetchData(marketplaceName, storeId, selectedDays.value);
});

watch(selectedDays, async (newValue) => {
  const userInfoResponse = store.getters.currentUser;
  const storeId = userInfoResponse?.Data?.user?.store[0]?.storeId;
  const marketplaceName =
    userInfoResponse?.Data?.user?.store[0]?.marketplaceName;

  if (!storeId || !marketplaceName) {
    console.error("storeId or marketplaceName is missing in userInfoResponse");
    return;
  }

  try {
    const newChartData = await fetchData(marketplaceName, storeId, newValue);

    const chart = Highcharts.chart(chartContainer.value, {
      title: {
        text: "Daily Sales",
        align: "left",
      },
      chart: {
        type: "column",
      },
      yAxis: {
        title: {
          text: "Amount ($)",
        },
        min: 0,
        max: 5000,
        tickInterval: 1000,
      },
      xAxis: {
        categories: newChartData.map(
          (item) => `${getDayByDate(item.date)}, ${item.date}`
        ),
      },
      plotOptions: {
        column: {
          stacking: "normal",
          allowPointSelect: true,
        },
      },
      series: [
        {
          name: "Profit",
          data: newChartData.map((item) => item.profit),
        },
        {
          name: "FBA Sales",
          data: newChartData.map((item) => item.fbaAmount),
          dataLabels: {
            // enabled: true,
            // rotation: 270,
            // formatter: function () {
            //   return currency.value + this.y;
            // },
          },
        },
        {
          name: "FBM Sales",
          data: newChartData.map((item) => item.fbmAmount),
        },
      ],
    });

    chart.series.forEach((series: any) => {
      series.points.forEach((point: any) => {
        point.graphic.on("click", function () {
          if (clickCount < 2) {
            const date = point.category.split(",")[1].trim();
            if (clickCount === 0) {
              firstDate.value = date;
              console.log(firstDate.value);

              showDetailTable.value = true;
              fetchDetailData(marketplaceName, storeId, firstDate.value);
            } else {
              secondDate.value = date;
              showDetailTable.value = true;
              fetchDetailData(marketplaceName, storeId, firstDate.value);
            }
            clickCount++;
          } else {
            alert("Maximum number of clicks reached!");
          }
        });
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>
