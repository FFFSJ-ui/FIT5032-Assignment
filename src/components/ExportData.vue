<template>
  <!-- From https://primevue.org/datatable/#export -->
  <div style="display: none">
    <DataTable :value="data" ref="dt">
      <Column v-for="column in columns" :key="column" :field="column" :header="column"></Column>
    </DataTable>
  </div>
  <button class="btn btn-success" @click="exportCSV">Export</button>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Data, column names, and file names
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  filename: {
    type: String,
    default: 'data',
  },
})

const dt = ref()
const exportCSV = () => {
  // Check if the data exists and the array is empty
  if (!props.data || props.data.length === 0) {
    alert('No data to export')
    return
  }
  dt.value.exportCSV()
}

defineExpose({
  exportCSV,
})
</script>