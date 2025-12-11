<template>
  <div class="page-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-content">
        <button @click="goBack" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span>Back</span>
        </button>
        <h1 class="nav-title">{{ isEditMode ? 'Edit Contact' : 'New Contact' }}</h1>
        <div class="nav-spacer"></div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <form @submit.prevent="handleSubmit" class="contact-form">
        <!-- Avatar Preview -->
        <div class="avatar-section">
          <div class="avatar-preview" :style="{ background: avatarColor }">
            {{ formData.firstName.charAt(0) || '?' }}{{ formData.lastName.charAt(0) || '' }}
          </div>
          <p class="avatar-hint">Avatar updates as you type</p>
        </div>

        <!-- Form Fields -->
        <div class="form-section">
          <h2 class="section-title">Basic Information</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name <span class="required">*</span></label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                placeholder="John"
                required
                :class="{ error: errors.firstName }"
              />
              <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name <span class="required">*</span></label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                placeholder="Doe"
                required
                :class="{ error: errors.lastName }"
              />
              <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="john@example.com"
                required
                :class="{ error: errors.email }"
              />
            </div>
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Additional Details</h2>

          <div class="form-group">
            <label for="company">Company</label>
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                <path d="M10 6h4"></path>
                <path d="M10 10h4"></path>
                <path d="M10 14h4"></path>
                <path d="M10 18h4"></path>
              </svg>
              <input
                id="company"
                v-model="formData.company"
                type="text"
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div class="form-group">
            <label for="address">Address</label>
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <input
                id="address"
                v-model="formData.address"
                type="text"
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea
              id="notes"
              v-model="formData.notes"
              placeholder="Add any notes about this contact..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn-submit" :disabled="submitting">
            <svg v-if="submitting" class="spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span>{{ submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Contact') }}</span>
          </button>
        </div>
      </form>
    </main>

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="toast">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="m9 11 3 3L22 4"></path>
        </svg>
        <span>Contact {{ isEditMode ? 'updated' : 'created' }} successfully!</span>
      </div>
    </Transition>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 Contact Book. Built with Vue 3 + Vite.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContacts } from '../composables/useContacts'

const router = useRouter()
const route = useRoute()
const { getContactById, addContact, updateContact } = useContacts()

const isEditMode = ref(false)
const submitting = ref(false)
const showSuccessToast = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  notes: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const colors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]

const avatarColor = computed(() => {
  if (!formData.firstName && !formData.lastName) {
    return '#e5e7eb'
  }
  const index = ((formData.firstName.charCodeAt(0) || 0) + (formData.lastName.charCodeAt(0) || 0)) % colors.length
  return colors[index]
})

onMounted(() => {
  const id = route.params.id
  if (id && route.path.includes('/edit')) {
    isEditMode.value = true
    const contact = getContactById(id)
    if (contact) {
      Object.assign(formData, contact)
    } else {
      router.push('/')
    }
  }
})

const validateForm = () => {
  let isValid = true
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  try {
    const contactData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim()
    }

    let contactId
    if (isEditMode.value) {
      const updated = updateContact(route.params.id, contactData)
      contactId = updated.id
    } else {
      const newContact = addContact(contactData)
      contactId = newContact.id
    }

    showSuccessToast.value = true
    setTimeout(() => {
      router.push(`/contact/${contactId}`)
    }, 1000)
  } catch (error) {
    console.error('Error saving contact:', error)
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  if (isEditMode.value) {
    router.push(`/contact/${route.params.id}`)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Navbar */
.navbar {
  background: #6366f1;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
}

.btn-back:hover {
  background: rgba(255,255,255,0.3);
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.nav-spacer {
  width: 80px;
}

/* Main Content */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* Avatar Section */
.avatar-section {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}

.avatar-hint {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}

/* Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.required {
  color: #e53935;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.form-group input.error {
  border-color: #e53935;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 40px;
}

.error-text {
  display: block;
  font-size: 12px;
  color: #e53935;
  margin-top: 4px;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-cancel, .btn-submit {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: #e5e5e5;
  color: #333;
}

.btn-cancel:hover {
  background: #d5d5d5;
}

.btn-submit {
  background: #6366f1;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-submit .spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #4caf50;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Footer */
.footer {
  margin-top: auto;
  padding: 20px;
  text-align: center;
  background: white;
  border-top: 1px solid #e5e5e5;
}

.footer p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* Mobile */
@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel, .btn-submit {
    width: 100%;
  }
}
</style>
