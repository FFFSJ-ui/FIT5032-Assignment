<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">User Profile</h1>
        <p class="text-center">
          View your personal information.
        </p>
        <div class="text-center mt-4">
          <button class="btn btn-danger" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, logout as appLogout } from '@/auth'
import '@/firebase/init'
import { getAuth, signOut } from 'firebase/auth'

const router = useRouter()

function checkLoggedIn() {
  if (!isAuthenticated.value) {
    router.replace('/first')
  }
}

async function logout() {
  const auth = getAuth()
  await signOut(auth)
  appLogout()
  router.replace('/home')
}

onMounted(() => {
  checkLoggedIn()
})

</script>

<style>
</style>