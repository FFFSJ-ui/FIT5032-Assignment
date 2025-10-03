<template>
  <div class="card flex justify-center">
    <Chart
      type="pie"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-[30rem]"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "primevue/chart";
import axios from "axios";

const chartData = ref();
const chartOptions = ref();

onMounted(async () => {
  await loadUserData();
});

const loadUserData = async () => {
  try {
    const response = await axios.get(
      "https://countusers-pmr3mcznla-uc.a.run.app"
    );
    const roleCounts = response.data.roleCounts;

    chartData.value = setChartData(roleCounts.user || 0, roleCounts.admin || 0);
    chartOptions.value = setChartOptions();
  } catch (error) {
    // Clear chart data
    chartData.value = null;
  }
};

const setChartData = (userCount, adminCount) => {
  const documentStyle = getComputedStyle(document.body);
  return {
    labels: ["Users", "Admins"],
    datasets: [
      {
        data: [userCount, adminCount],
        backgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-500"),
          documentStyle.getPropertyValue("--p-orange-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-400"),
          documentStyle.getPropertyValue("--p-orange-400"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  return {
    // Role tag
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
};
</script>
