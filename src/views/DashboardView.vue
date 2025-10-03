<script setup>
import EventsTable from '@/components/EventsTable.vue';
import PieChart from '@/components/PieChart.vue';
import UsersTable from '@/components/UsersTable.vue'

</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Admin Dashboard</h1>
      </div>
      <UsersTable />
      <EventsTable />
      <PieChart />
    </div>
  </div>
</template>


<style>
/* Actives column */
.table th:last-child,
.table td:last-child {
  min-width: 100px;
  white-space: nowrap;
}
</style>