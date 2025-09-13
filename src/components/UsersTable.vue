<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import db from '@/firebase/init'
import { collection, getDocs } from 'firebase/firestore'

const users = ref([])

const loadUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    users.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }))
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="container mt-5">
    <DataTable :value="users" tableStyle="min-width: 50rem">
      <Column field="username" header="Username"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="rating" header="Rating"></Column>
      <Column field="role" header="Role"></Column>
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
