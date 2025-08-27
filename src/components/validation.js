import {ref} from 'vue'
export default function userValidation() {
    const errors = ref({
  username: null,
  password: null,
  isAustralian: null,
  reason: null,
  gender: null,
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
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

const validateIsAustralian = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) errors.value.isAustralian = 'You must confirm residency.'
  } else {
    errors.value.isAustralian = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'You must select a gender.'
  } else {
    errors.value.gender = null
  }
}

const validateReason = (blur) => {
  const reason = formData.value.reason
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(reason)
  if (!reason) {
    if (blur) errors.value.reason = 'Reason cannot be empty.'
  } else if (reason.length > 100) {
    if (blur) errors.value.reason = 'Reason must be within 100 characters.'
  } else if (hasSpecialChar) {
    if (blur) errors.value.reason = 'Reason cannot contain special characters.'
  } else {
    errors.value.reason = null
  }
}
}