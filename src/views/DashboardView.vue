<script setup>
import UsersTable from '@/components/UsersTable.vue'

</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Users Table</h1>
      </div>
      <UsersTable />
    </div>
  </div>
</template>


<style>
/* DataTable */
.p-datatable td {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 400px;
}
</style>