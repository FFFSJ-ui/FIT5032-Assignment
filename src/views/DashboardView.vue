<script setup>
import EventsTable from "@/components/EventsTable.vue";
import LineChart from "@/components/LineChart.vue";
import UsersTable from "@/components/UsersTable.vue";
import SendGrid from "@/components/SendGrid.vue";
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Admin Dashboard</h1>
      </div>
      <UsersTable />
      <EventsTable />
      <div class="mt-5">
        <h1>Platform activity - events released</h1>
        <LineChart />
      </div>
      <div class="col-12">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-10 col-lg-9 mt-5">
            <SendGrid />
          </div>
        </div>
      </div>
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
