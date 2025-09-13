<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import DatePicker from 'primevue/calendar'
import UsersTable from '@/components/UsersTable.vue'
import router from '@/router'
import ActiveForm from '@/components/ActiveForm.vue'
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

const formData = ref({
  title: '',
  content: '',
  time: '',
  location: '',
})

const submittedCards = ref([])

const submitForm = () => {
  validateTitle(true)
  validateContent(true)
  validateTime(true)
  validateLocation(true)
  if (
    !errors.value.title &&
    !errors.value.content &&
    !errors.value.time &&
    !errors.value.location
  ) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    title: '',
    content: '',
    time: '',
    location: '',
  }
}

const errors = ref({
  title: null,
  content: null,
  time: null,
  location: null,
})

const validateTitle = (blur) => {
  const title = formData.value.title
  if (formData.value.title.length < 3 || formData.value.title.length > 100) {
    if (blur) errors.value.title = 'Title must be 3 - 100 characters'
  } else if (!/^[a-zA-Z0-9\s.,!?'"():;@#%&*\-+=/_]*$/.test(title)) {
    if (blur)
      errors.value.title = 'Title must be letters, numbers, spaces or common punctuation marks'
  } else {
    errors.value.title = null
  }
}

const validateContent = (blur) => {
  const content = formData.value.content
  if (formData.value.content.length > 500) {
    if (blur) errors.value.content = 'Content must be within 500 characters'
  } else if (!/^[a-zA-Z0-9\s.,!?'"():;@#%&*\-+=/_]*$/.test(content)) {
    if (blur)
      errors.value.content = 'Content must be letters, numbers, spaces or common punctuation marks'
  } else {
    errors.value.content = null
  }
}

const validateTime = (blur) => {
  if (!formData.value.time) {
    if (blur) errors.value.time = 'Time is required'
  } else {
    errors.value.time = null
  }
}

const validateLocation = (blur) => {
  const location = formData.value.location
  if (formData.value.location.length < 2) {
    if (blur) errors.value.location = 'Location must be at least 2 characters'
  } else if (!/^[a-zA-Z0-9\s.,!?'"():;@#%&*\-+=/_]*$/.test(location)) {
    if (blur)
      errors.value.location =
        'Location must be letters, numbers, spaces or common punctuation marks'
  } else {
    errors.value.location = null
  }
}
</script>

<template>
  <div class="container mt-5">
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
  <UsersTable />
</template>

<style>
.form-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  /* background-color: #e0bfbf; */
  border-radius: 10px;
}

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
