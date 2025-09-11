import { ref } from 'vue'
import db from '@/firebase/init'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'

export const isAuthenticated = ref(false)
export const currentUser = ref(null)

const auth = getAuth()

const isAuthInitialized = ref(false)
let resolveInitialization 
const initializationPromise  = new Promise((resolve) => (resolveInitialization = resolve))

onAuthStateChanged(auth, async (user) => {
  if (user) {
    isAuthenticated.value = true
    try {
      const querySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', user.email), limit(1)))
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data() || {}
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            username: data.username,
            role: data.role,
            rating: data.rating,
          })
        } else {
        currentUser.value = { uid: user.uid, email: user.email }
      }
    } catch (error) {
      currentUser.value = { uid: user.uid, email: user.email }
    }
  } else {
    isAuthenticated.value = false
    currentUser.value = null
  }
  if (!isAuthInitialized.value) {
    isAuthInitialized.value = true
    resolveInitialization?.()
  }
})

export function waitInitialization() {
  return isAuthInitialized.value ? Promise.resolve() : initializationPromise
}

export function setCurrentUser(user) {
  currentUser.value = user
  isAuthenticated.value = true
}

export function logout() {
  isAuthenticated.value = false
  currentUser.value = null
}