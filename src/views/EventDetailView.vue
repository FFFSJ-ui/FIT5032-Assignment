<template>
  <div class="container mt-5">
    <button @click="goBack" class="btn btn-primary mb-3">← Back</button>
    <div v-if="eventDetail" class="card">
      <div class="card-body">
        <h3>{{ eventDetail.title }}</h3>
        <p>{{ formatDate(eventDetail.createat) }}</p>
        <p>{{ eventDetail.content }}</p>
        <p>Location: {{ eventDetail.location }}</p>
        <p>Start Time: {{ formatDate(eventDetail.time) }}</p>
        <p>Organizer email: {{ eventDetail.email }}</p>
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
const eventDetail = ref(null)
const ratingValue = ref(0)
const errors = ref({ rating: null })

const loadEventDetail = async () => {
  try {
    const eventId = route.params.id
    const docReference = doc(db, 'events', eventId)
    const docSnapshot = await getDoc(docReference)
    eventDetail.value = {
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
      // find the user who created this event
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', eventDetail.value.email),
      )
      const userSnapshot = await getDocs(usersQuery)
      const userDoc = userSnapshot.docs[0]
      const userData = userDoc.data()
      const currentRating = userData.rating
      // calculate the average between the rating of user for the event and Publisher's own rating
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
  loadEventDetail()
})
</script>

<style scoped>
:deep(.p-rating .p-rating-icon) {
  color: #000000 !important; 
}
</style>