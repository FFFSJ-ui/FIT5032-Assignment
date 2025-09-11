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
import db from '@/firebase/init'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { setCurrentUser } from '@/auth'

const router = useRouter()
const formData = ref({
  email: '',
  password: ''
})

const submitForm = async () => {
  validateEmail(true)
  validatePassword(true)
  if (!errors.value.email && !errors.value.password) {
    try {
      const auth = getAuth()
      const credentials = await signInWithEmailAndPassword(
        auth,
        formData.value.email,
        formData.value.password,
      )
      const user = credentials.user
      try {
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', user.email), limit(1)))
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data() || {}
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            username: data.username,
            role: data.role,
          })
        } else {
          setCurrentUser({ uid: user.uid, email: user.email })
        }
      } catch {
        setCurrentUser({ uid: user.uid, email: user.email })
      }
      await router.push('/home')
      clearForm()
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errors.value.email = 'Invalid email or password'
      } else if (error.code === 'auth/too-many-requests') {
        errors.value.email = 'Too many requests, please wait a while'
      } else {
        errors.value.email = 'Login failed'
      }
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
</script>

<style scoped>
/* our logic will go here */

</style>
