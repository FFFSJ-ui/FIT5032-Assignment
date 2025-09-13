<template>
  <div class="container mt-5">
    <button @click="goBack" class="btn btn-primary mb-3">← Back</button>
    <div v-if="activeDetail" class="card">
      <div class="card-body">
        <h3>{{ activeDetail.title }}</h3>
        <p>{{ formatDate(activeDetail.createat) }}</p>
        <p>{{ activeDetail.content }}</p>
        <p>Location: {{ activeDetail.location }}</p>
        <p>Start Time: {{ formatDate(activeDetail.time) }}</p>
        <div class="rating-container mt-4">
          <form @submit.prevent="ratingSubmit" class="d-flex flex-column gap-3 align-items-center">
            <div class="d-flex flex-column align-items-center gap-2">
              <Rating
                v-model="ratingValue"
                :stars="5"
                :cancel="false"
                @change="validateRating(false)"
              />
              <div v-if="errors.rating" class="text-danger">{{ errors.rating }}</div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import db from '@/firebase/init'
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore'
import Rating from 'primevue/rating'
import { isAuthenticated } from '@/auth'

const route = useRoute()
const router = useRouter()
const activeDetail = ref(null)
const ratingValue = ref(0)
const errors = ref({ rating: null })

const loadActiveDetail = async () => {
  try {
    const activeId = route.params.id
    const docReference = doc(db, 'actives', activeId)
    const docSnapshot = await getDoc(docReference)
    activeDetail.value = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }
  } catch (error) {
    console.error(error)
    goBack()
  }
}

const goBack = () => {
  router.push('/home')
}

const formatDate = (date) => {
  return date.toDate().toLocaleString()
}

const validateRating = (blur) => {
  if (!isAuthenticated.value) {
    if (blur) errors.value.rating = 'Please login to submit a rating.'
  } else if (!ratingValue.value) {
    if (blur) errors.value.rating = 'Rating is required.'
  } else {
    errors.value.rating = null
  }
}

const ratingSubmit = async () => {
  validateRating(true)
  if (!errors.value.rating) {
    try {
      // find the user who created this active
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', activeDetail.value.email),
      )
      const userSnapshot = await getDocs(usersQuery)
      const userDoc = userSnapshot.docs[0]
      const userData = userDoc.data()
      const currentRating = userData.rating
      // calculate the average between publish the active user and this rating
      const newRating = Math.round(((currentRating + ratingValue.value) / 2) * 100) / 100
      await updateDoc(doc(db, 'users', userDoc.id), {
        rating: newRating,
      })
      alert('Rating submitted successfully!')
    } catch (error) {
      console.error(error)
    }
  }
}

onMounted(() => {
  loadActiveDetail()
})
</script>

<style scoped>
:deep(.p-rating .p-rating-icon) {
  color: #000000 !important; 
}
</style>