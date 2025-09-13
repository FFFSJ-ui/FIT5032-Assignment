<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import db from '@/firebase/init'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

const actives = ref([])

const loadActives = async () => {
  const querySnapshot = await getDocs(query(collection(db, 'actives'), orderBy('createat', 'desc')))
  actives.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

const acitveDetail = (active) => {
  router.push(`/active/${active.id}`)
}

const formatDate = (date) => {
  return date.toDate().toLocaleString()
}

const longContent = (content) => {
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

onMounted(() => {
  loadActives()
})


</script>

<template>
  <div class="form-container mt-5">
    <h1 class="text-center">Active</h1>
    <div class="mb-3">
      <div
        v-for="active in actives"
        :key="active.id"
        class="card mb-3"
        @click="acitveDetail(active)"
        style="cursor: pointer"
      >
        <div class="card-body">
          <h5>{{ active.title }}</h5>
          <p>{{ formatDate(active.createat) }}</p>
          <p>{{ longContent(active.content) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

/* ID selectors */
#title:focus,
#content:focus,
#time:focus,
#location:focus {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* DataTable */
.p-datatable td {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 400px;
}
</style>
