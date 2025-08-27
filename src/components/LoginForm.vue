<template>
  <div class="container mt-5 d-flex justify-content-center">
      <div class="user-form">
        <h1 class="text-center">Login</h1>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              id="email"
              @blur="() => validateEmail(true)"
              @input="() => validateEmail(false)"
              v-model="formData.email"
            />
            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
              v-model="formData.password"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup>
// Our logic will go here
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import usersData from '@/assets/json/users.json'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup' // optional
import Row from 'primevue/row' // optional
const router = useRouter()
const formData = ref({
  email: '',
  password: ''
})

const submittedCards = ref([])

const submitForm = () => {
  validateEmail(true)
  validatePassword(true)
  if (!errors.value.email && !errors.value.password) {
    const user = usersData.find(u => 
      u.email === formData.value.email && 
      u.password === formData.value.password
    )
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      const loginRecord = {
          user: user,
          loginTime: new Date().toISOString(),
          isLoggedIn: true
        }
        localStorage.setItem('loginStatus', JSON.stringify(loginRecord))
      router.push('/home')
      clearForm()
    } else {
      errors.value.email = 'Invalid email or password'
    }
  }
}

const clearForm = () => {
  formData.value = {
    email: '',
    password: ''
  }
}

const errors = ref({
  email: null,
  password: null
})

const validateEmail = (blur) => {
  const email = formData.value.email
  if (formData.value.email.length < 5) {
    if (blur) errors.value.email = 'Email must be at least 5 characters'
  } else if (!/^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/.test(email)) {
    if (blur) errors.value.email = 'Email must be in the correct format'
    return
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}
</script>

<style scoped>
/* our logic will go here */

</style>
