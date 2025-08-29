<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import usersData from '@/assets/json/users.json'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const router = useRouter()

const formData = ref({
  username: '',
  email: '',
  role: 'user',
  password: '',
  confirmPassword: ''
})

const submittedCards = ref([])

const submitForm = async() => {
  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  if (!errors.value.username && !errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const allUsers = [...usersData, ...existingUsers]

    const existingUser = allUsers.find(u => u.email === formData.value.email)
    if (existingUser) {
      errors.value.email = 'Email already exists'
      return
    }
    const newUser = {
      "Document ID": allUsers.length + 1,
      "username": formData.value.username,
      "email": formData.value.email,
      "rating": 5,
      "role": formData.value.role,
      "password": formData.value.password,
      "createdAt": new Date().toISOString()
    }

    existingUsers.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))
    localStorage.setItem('currentUser', JSON.stringify(newUser))

    const loginRecord = {
      user: newUser,
      loginTime: new Date().toISOString(),
      isLoggedIn: true
    }
    localStorage.setItem('loginStatus', JSON.stringify(loginRecord))

    await router.push('/home')
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  }
}

const errors = ref({
  username: null,
  email: null,
  role: null,
  password: null,
  confirmPassword: null
})

const validateName = (blur) => {
  const name = formData.value.name
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9\s.,!?'"():;@#%&*\-+=/_]*$/.test(name)) {
    if (blur) errors.value.content = 'Name must be letters, numbers, spaces or common punctuation marks'
  } else {
    errors.value.username = null
  }
}

const validateEmail = (blur) => {
  const email = formData.value.email
  if (formData.value.email.length < 5) {
    if (blur) errors.value.email = 'Email must be at least 5 characters'
  } else if (!/^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/.test(email)) {
    if (blur) errors.value.email = 'Email must be in the correct format (xxx@xx.xxx)'
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
/**
 * Confirm password validation function that checks if the password and confirm password fields match.
 * @param blur: boolean - If true, the function will display an error message if the passwords do not match.
 */
const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

</script>

<template>
  <div class="container mt-5 d-flex justify-content-center">
      <div class="user-form">
        <h1 class="text-center">Register</h1>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
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
            </div>
            <div class="mb-3">
              <label for="role" class="form-label">Role</label>
              <select class="form-select" id="role" v-model="formData.role" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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
            <div class="mb-3">
    <label for="confirm-password" class="form-label">Confirm password</label>
    <input
        type="password"
        class="form-control"
        id="confirm-password"
        v-model="formData.confirmPassword"
        @blur="() => validateConfirmPassword(true)"
    />
    <div v-if="errors.confirmPassword" class="text-danger">
        {{ errors.confirmPassword }}
    </div>
</div>
          </div>
          
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>

  </div>


  <div class="row mt-5" v-if="submittedCards.length">
    <div class="d-flex flex-wrap justify-content-start">
      <div
        v-for="(card, index) in submittedCards"
        :key="index"
        class="card m-2"
        style="width: 18rem"
      >
        <div class="card-header">User Information</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Username: {{ card.username }}</li>
          <li class="list-group-item">Password: {{ card.password }}</li>
          <li class="list-group-item">
            Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
          </li>
          <li class="list-group-item">Gender: {{ card.gender }}</li>
          <li class="list-group-item">Reason: {{ card.reason }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* our logic will go here */

</style>