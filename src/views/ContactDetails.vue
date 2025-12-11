<template>
  <div class="page-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-content">
        <button @click="goHome" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span>Back</span>
        </button>
        <div v-if="contact" class="nav-actions">
          <button @click="goToEdit" class="btn-edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <span>Edit</span>
          </button>
          <button v-if="!contact.blocked" @click="confirmBlock" class="btn-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m4.9 4.9 14.2 14.2"></path>
            </svg>
            <span>Block</span>
          </button>
          <button v-else @click="handleUnblock" class="btn-unblock">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path>
              <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path>
              <path d="M12 2v4"></path>
              <path d="m2 2 20 20"></path>
            </svg>
            <span>Unblock</span>
          </button>
          <button @click="confirmDelete" class="btn-delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading contact...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!contact" class="error-state">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
          <line x1="9" x2="9.01" y1="9" y2="9"></line>
          <line x1="15" x2="15.01" y1="9" y2="9"></line>
        </svg>
      </div>
      <h2>Contact Not Found</h2>
      <p>The contact you're looking for doesn't exist or has been deleted.</p>
      <button @click="goHome" class="btn-primary">
        Go Back Home
      </button>
    </div>

    <!-- Contact Details -->
    <main v-else class="main-content">
      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-header" :style="{ background: contact.photoUrl ? 'transparent' : getAvatarColor(contact) }">
          <div class="avatar">
            <img v-if="contact.photoUrl" :src="contact.photoUrl" alt="Contact photo" class="avatar-img" />
            <span v-else>{{ getInitials(contact) }}</span>
          </div>
        </div>
        <div class="profile-body">
          <h1 class="contact-name">
            {{ contact.firstName }} {{ contact.lastName }}
            <span v-if="contact.blocked" class="blocked-badge">Blocked</span>
          </h1>
          <p v-if="contact.company" class="contact-company">{{ contact.company }}</p>
        </div>
      </div>

      <!-- Contact Info Card -->
      <div class="info-card">
        <h2 class="card-title">Contact Information</h2>
        
        <div class="info-list">
          <!-- Email -->
          <a :href="`mailto:${contact.email}`" class="info-item">
            <div class="info-icon email">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div class="info-content">
              <span class="info-label">Email</span>
              <span class="info-value">{{ contact.email }}</span>
            </div>
            <svg class="info-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>

          <!-- Phone -->
          <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="info-item">
            <div class="info-icon phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="info-content">
              <span class="info-label">Phone</span>
              <span class="info-value">{{ contact.phone }}</span>
            </div>
            <svg class="info-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>

          <!-- Address -->
          <div v-if="contact.address" class="info-item static">
            <div class="info-icon location">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="info-content">
              <span class="info-label">Address</span>
              <span class="info-value">{{ contact.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Card -->
      <div v-if="contact.notes" class="info-card">
        <h2 class="card-title">Notes</h2>
        <p class="notes-content">{{ contact.notes }}</p>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2025 Contact Book. Built with Vue 3 + Vite.</p>
      </footer>
    </main>

    <!-- Delete Modal -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
        <div class="modal" @click.stop>
          <div class="modal-icon delete-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
          </div>
          <h2>Delete Contact?</h2>
          <p>
            Are you sure you want to delete <strong>{{ contact.firstName }} {{ contact.lastName }}</strong>? 
            This action cannot be undone.
          </p>
          <div class="modal-actions">
            <button @click="cancelDelete" class="btn-cancel">Cancel</button>
            <button @click="handleDelete" class="btn-confirm-delete">Delete</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Block Modal -->
    <Transition name="modal">
      <div v-if="showBlockModal" class="modal-overlay" @click="cancelBlock">
        <div class="modal" @click.stop>
          <div class="modal-icon block-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m4.9 4.9 14.2 14.2"></path>
            </svg>
          </div>
          <h2>Block Contact?</h2>
          <p>
            Are you sure you want to block <strong>{{ contact.firstName }} {{ contact.lastName }}</strong>? 
            They will be moved to your blocked list.
          </p>
          <div class="modal-actions">
            <button @click="cancelBlock" class="btn-cancel">Cancel</button>
            <button @click="handleBlock" class="btn-confirm-block">Block</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContacts } from '../composables/useContacts'

const router = useRouter()
const route = useRoute()
const { getContactById, deleteContact, blockContact, unblockContact, updateLastContacted } = useContacts()

const contact = ref(null)
const loading = ref(true)
const showDeleteModal = ref(false)
const showBlockModal = ref(false)

const colors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]

onMounted(() => {
  const id = route.params.id
  contact.value = getContactById(id)
  loading.value = false
  
  // Update last contacted when viewing details
  if (contact.value) {
    updateLastContacted(id)
  }
})

const getAvatarColor = (contact) => {
  const index = (contact.firstName.charCodeAt(0) + contact.lastName.charCodeAt(0)) % colors.length
  return colors[index]
}

const getInitials = (contact) => {
  return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()
}

const goHome = () => router.push('/')
const goToEdit = () => router.push(`/contact/${contact.value.id}/edit`)

// Delete handlers
const confirmDelete = () => { showDeleteModal.value = true }
const cancelDelete = () => { showDeleteModal.value = false }
const handleDelete = () => {
  deleteContact(contact.value.id)
  showDeleteModal.value = false
  router.push('/')
}

// Block handlers
const confirmBlock = () => { showBlockModal.value = true }
const cancelBlock = () => { showBlockModal.value = false }
const handleBlock = () => {
  blockContact(contact.value.id)
  contact.value = getContactById(contact.value.id)
  showBlockModal.value = false
}
const handleUnblock = () => {
  unblockContact(contact.value.id)
  contact.value = getContactById(contact.value.id)
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f8fafc;
}

/* Navbar */
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  background: transparent;
  color: #6366f1;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}

.btn-back:active {
  background: #f3f4f6;
}

.nav-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete, .btn-block, .btn-unblock {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}

.btn-edit span, .btn-delete span, .btn-block span, .btn-unblock span {
  display: none;
}

.btn-edit {
  background: #6366f1;
  color: white;
}

.btn-edit:active {
  background: #4f46e5;
}

.btn-block {
  background: #fef3c7;
  color: #d97706;
}

.btn-block:active {
  background: #fde68a;
}

.btn-unblock {
  background: #d1fae5;
  color: #059669;
}

.btn-unblock:active {
  background: #a7f3d0;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:active {
  background: #fecaca;
}

/* Loading & Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  color: #9ca3af;
  margin-bottom: 16px;
}

.error-icon svg {
  width: 48px;
  height: 48px;
}

.error-state h2 {
  font-size: 1.25rem;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.error-state p {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 0.9rem;
}

/* Main Content */
.main-content {
  padding: 20px 16px;
}

/* Profile Card */
.profile-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.profile-header {
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #6366f1;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(40px);
  position: relative;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.profile-body {
  padding: 52px 20px 20px;
  text-align: center;
}

.contact-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.blocked-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #fef3c7;
  color: #d97706;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-company {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Info Card */
.info-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}

.card-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

.info-item:not(.static):active {
  background: #f3f4f6;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon.email {
  background: #dbeafe;
  color: #2563eb;
}

.info-icon.phone {
  background: #dcfce7;
  color: #16a34a;
}

.info-icon.location {
  background: #fef3c7;
  color: #d97706;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 2px;
}

.info-value {
  display: block;
  font-size: 0.95rem;
  color: #1a1a2e;
  font-weight: 500;
  word-break: break-word;
}

.info-arrow {
  color: #d1d5db;
}

.notes-content {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.6;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 28px 24px 40px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  color: #f59e0b;
  margin-bottom: 12px;
}

.modal-icon svg {
  width: 40px;
  height: 40px;
}

.modal h2 {
  font-size: 1.25rem;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.modal p {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-cancel, .btn-confirm-delete, .btn-confirm-block, .btn-primary {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  border: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:active {
  background: #e5e7eb;
}

.btn-confirm-delete {
  background: #ef4444;
  color: white;
}

.btn-confirm-delete:active {
  background: #dc2626;
}

.btn-confirm-block {
  background: #f59e0b;
  color: white;
}

.btn-confirm-block:active {
  background: #d97706;
}

.btn-primary {
  background: #6366f1;
  color: white;
}

.btn-primary:active {
  background: #4f46e5;
}

/* Modal Icon Colors */
.modal-icon.delete-icon {
  color: #ef4444;
}

.modal-icon.block-icon {
  color: #f59e0b;
}

/* Modal Transition */
.modal-enter-active, .modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal, .modal-leave-to .modal {
  transform: translateY(100%);
}

/* Footer */
.footer {
  text-align: center;
  padding: 20px;
  margin-top: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.footer p {
  font-size: 13px;
  color: #666;
  margin: 0;
}
</style>
