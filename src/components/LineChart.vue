<!-- Form https://primevue.org/chart/#line -->
<template>
  <div class="card">
    <div class="flex justify-content-end mb-4">
      <div class="btn-group mb-3 w-100" role="group">
        <button
          class="btn btn-outline-success"
          :class="{ active: activeTab === 'chart' }"
          @click="activeTab = 'chart'"
        >
          Chart
        </button>
        <button
          class="btn btn-outline-success"
          :class="{ active: activeTab === 'table' }"
          @click="activeTab = 'table'"
        >
          Table
        </button>
      </div>
      <div>
        <Dropdown
          v-model="selectedMonth"
          :options="timeOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full md:w-14rem"
        />
      </div>
    </div>
    <Chart
      v-if="chartData && activeTab === 'chart'"
      type="line"
      :data="chartData"
      :options="chartOptions"
      style="height: 300px"
    />
    <!-- Data table -->
    <table class="table table-striped" v-if="activeTab === 'table'">
      <thead class="table-success">
        <tr>
          <th>{{ selectedMonth === "year" ? "Month" : "Day" }}</th>
          <th>Events</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="index">
          <td>{{ item.label }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Chart from "primevue/chart";
import Dropdown from "primevue/dropdown";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/init.js";

const chartData = ref(null);
const selectedMonth = ref("year");
const eventsData = ref([]);
const activeTab = ref("chart");

// Drop-down box configuration
const timeOptions = ref([
  { label: "This Year", value: "year" },
  // Generate month array
  ...Array.from({ length: 12 }, (_, i) => ({
    label: new Date(0, i).toLocaleString("en", { month: "long" }),
    value: i,
  })),
]);

const chartOptions = computed(() => {
  const fontStyle = { size: 14, weight: "bold" };
  return {
    // Chart Fill container
    maintainAspectRatio: false,
    plugins: {
      // Hide label
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        titleFont: fontStyle,
        bodyFont: fontStyle,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const item = tooltipItems[0];
            return selectedMonth.value === "year"
              ? `Month: ${item.label}`
              : `Day: ${item.label}`;
          },
          label: (tooltipItem) => `Events: ${tooltipItem.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            selectedMonth.value === "year"
              ? "Months in 2025"
              : `Days of ${timeOptions.value.find((m) => m.value === selectedMonth.value)?.label}`,
          font: fontStyle,
        },
        ticks: { font: fontStyle },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Events",
          font: fontStyle,
        },
        ticks: {
          precision: 0,
          stepSize: 1,
          font: fontStyle,
        },
      },
    },
  };
});

onMounted(async () => {
  await loadEventsData();
});

watch(selectedMonth, () => {
  updateChartData();
});

const tableData = computed(
  () =>
    chartData.value?.labels?.map((label, i) => ({
      label,
      value: chartData.value.datasets[0].data[i],
    })) || []
);

const loadEventsData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    eventsData.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let eventDate;
      // Handle date format
      if (data.createat.toDate) {
        eventDate = data.createat.toDate();
      } else if (data.createat.seconds) {
        eventDate = new Date(data.createat.seconds * 1000);
      } else {
        eventDate = new Date(data.createat);
      }
      return {
        id: doc.id,
        ...data,
        createat: eventDate,
      };
    });
    updateChartData();
  } catch (error) {
    console.error("Error loading events:", error);
    eventsData.value = [];
    updateChartData();
  }
};

//Count monthly events
const processYearlyData = () => {
  const monthlyCounts = Array(12).fill(0);
  // Iterate through events
  eventsData.value.forEach((event) => {
    if (event.createat && event.createat instanceof Date) {
      const month = event.createat.getMonth();
      monthlyCounts[month]++;
    }
  });
  return monthlyCounts;
};

//Count daily events
const processMonthlyData = (monthIndex) => {
  const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
  const dailyCounts = Array(daysInMonth).fill(0);
  eventsData.value.forEach((event) => {
    if (event.createat && event.createat instanceof Date) {
      const eventDate = event.createat;
      if (
        eventDate.getFullYear() === 2025 &&
        eventDate.getMonth() === monthIndex
      ) {
        const dayIndex = eventDate.getDate() - 1;
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          dailyCounts[dayIndex]++;
        }
      }
    }
  });

  return dailyCounts;
};

const updateChartData = () => {
  // Set an empty chart if no data
  if (!eventsData.value.length) {
    chartData.value = {
      labels: [],
      datasets: [],
    };
    return;
  }
  if (selectedMonth.value === "year") {
    const monthlyData = processYearlyData();
    chartData.value = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          data: monthlyData,
          fill: false,
        },
      ],
    };
  } else {
    const dailyData = processMonthlyData(selectedMonth.value);
    chartData.value = {
      // Display the month label
      labels: dailyData.map((_, i) => (i + 1).toString()),
      datasets: [
        {
          data: dailyData,
          fill: false,
        },
      ],
    };
  }
};
</script>
