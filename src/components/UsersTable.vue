<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import usersData from '@/assets/json/users.json'

const users = ref([])

onMounted(() => {
  const jsonUsers = [...usersData]
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  users.value = [...jsonUsers, ...registeredUsers]
})
</script>

<template>
  <div class="container mt-5">
    <DataTable :value="users" tableStyle="min-width: 50rem">
      <Column field="Document ID" header="Document ID"></Column>
      <Column field="username" header="Username"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="rating" header="Rating"></Column>
      <Column field="role" header="Role"></Column>
      <Column field="password" header="Password"></Column>
    </DataTable>
  </div>
</template>

<style>
.p-datatable td {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 400px;
}
</style>
