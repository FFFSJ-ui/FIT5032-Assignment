<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import DatePicker from 'primevue/calendar'
import UsersTable from '@/components/UsersTable.vue'

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
    if (blur) errors.value.content = 'Title must be letters, numbers, spaces or common punctuation marks'
  } else {
    errors.value.title = null
  }
}

const validateContent = (blur) => {
  const content = formData.value.content
  if (formData.value.content.length > 500) {
    if (blur) errors.value.content = 'Content must be within 500 characters'
  } else if (!/^[a-zA-Z0-9\s.,!?'"():;@#%&*\-+=/_]*$/.test(content)) {
    if (blur) errors.value.content = 'Content must be letters, numbers, spaces or common punctuation marks'
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
    if (blur) errors.value.content = 'Location must be letters, numbers, spaces or common punctuation marks'
  } else {
    errors.value.location = null
  }
}
</script>

<template>
  <!-- 🗄️ W3. Library Registration Form -->
  <div class="form-container mt-5">
    <h1 class="text-center">🗄️ Active Management</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          id="title"
          @blur="() => validateTitle(true)"
          @input="() => validateTitle(false)"
          v-model="formData.title"
        />
        <div v-if="errors.title" class="text-danger">{{ errors.title }}</div>
        <div class="mb-3">
          <label for="time" class="form-label">Time</label>
          <DatePicker
            id="datepicker-24h"
            v-model="formData.time"
            showTime
            hourFormat="24"
            fluid
            :editable="false"
            @blur="() => validateTime(true)"
            @input="() => validateTime(false)"
            @date-select="() => validateTime(false)"
          />
          <div v-if="errors.time" class="text-danger">{{ errors.time }}</div>
        </div>
        <div class="mb-3">
          <label for="location" class="form-label">Location</label>
          <input
            type="text"
            class="form-control"
            id="location"
            @blur="() => validateLocation(true)"
            @input="() => validateLocation(false)"
            v-model="formData.location"
          />
          <div v-if="errors.location" class="text-danger">{{ errors.location }}</div>
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">Content</label>
          <textarea
            class="form-control"
            id="content"
            rows="3"
            v-model="formData.content"
            @blur="() => validateContent(true)"
            @input="() => validateContent(false)"
          ></textarea>
          <div v-if="errors.content" class="text-danger">{{ errors.content }}</div>
        </div>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary me-2">Submit</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
      </div>
    </form>
  </div>

  <div class="container mt-5">
    <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
      <Column field="title" header="Title"></Column>
      <Column field="content" header="Content"></Column>
      <Column field="time" header="Time"></Column>
      <Column field="location" header="Location"></Column>
    </DataTable>
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
