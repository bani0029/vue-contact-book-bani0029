<template>
  <div class="page-container">
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span class="logo-text">Contact Book</span>
        </div>
        <button @click="goToNewContact" class="btn-new">
          <span class="btn-icon">+</span>
          <span class="btn-text">New Contact</span>
        </button>
      </div>
    </nav>

    <main class="main-content">
      <div class="hero">
        <h1>Contact Book</h1>
        <p class="hero-subtitle">Your Contact List</p>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Results Info -->
      <div class="results-info">
        <span v-if="filteredContacts.length > 0" class="results-count">
          {{ filteredContacts.length }} {{ filteredContacts.length === 1 ? 'contact' : 'contacts' }}
          <span v-if="searchQuery"> matching "{{ searchQuery }}"</span>
        </span>
        <span v-else-if="searchQuery" class="no-results">
          No contacts found for "{{ searchQuery }}"
        </span>
      </div>

      <!-- Contacts Grid -->
      <div v-if="filteredContacts.length > 0" class="contacts-grid">
        <article
          v-for="contact in filteredContacts"
          :key="contact.id"
          class="contact-card"
          @click="goToContact(contact.id)"
          tabindex="0"
          @keyup.enter="goToContact(contact.id)"
        >
          <div class="card-avatar" :style="{ background: getAvatarColor(contact) }">
            {{ getInitials(contact) }}
          </div>
          <div class="card-content">
            <h3 class="card-name">{{ contact.firstName }} {{ contact.lastName }}</h3>
            <p class="card-email">{{ contact.email }}</p>
            <p v-if="contact.phone" class="card-phone">{{ contact.phone }}</p>
          </div>
          <div class="card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else-if="!searchQuery" class="empty-state">
        <div class="empty-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h2>No contacts yet</h2>
        <p>Start building your network by adding your first contact</p>
        <button @click="goToNewContact" class="btn-primary">
          <span>+</span> Add Your First Contact
        </button>
      </div>

      <!-- Blocked Contacts Section -->
      <div v-if="blockedContacts.length > 0 && !searchQuery" class="blocked-section">
        <button @click="showBlocked = !showBlocked" class="blocked-header">
          <div class="blocked-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m4.9 4.9 14.2 14.2"></path>
            </svg>
            <span>Blocked Contacts ({{ blockedContacts.length }})</span>
          </div>
          <svg :class="{ rotated: showBlocked }" class="chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
        
        <div v-if="showBlocked" class="blocked-list">
          <article
            v-for="contact in blockedContacts"
            :key="contact.id"
            class="contact-card blocked"
            @click="goToContact(contact.id)"
            tabindex="0"
            @keyup.enter="goToContact(contact.id)"
          >
            <div class="card-avatar blocked-avatar" :style="{ background: getAvatarColor(contact) }">
              {{ getInitials(contact) }}
            </div>
            <div class="card-content">
              <h3 class="card-name">{{ contact.firstName }} {{ contact.lastName }}</h3>
              <p class="card-email">{{ contact.email }}</p>
            </div>
            <div class="card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 Contact Book. Built with Vue 3 + Vite.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContacts } from '../composables/useContacts'

const router = useRouter()
const { searchContacts, getAllContacts, getBlockedContacts } = useContacts()

const showBlocked = ref(false)

const searchQuery = ref('')

// Avatar colors based on name
const colors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
]

const getAvatarColor = (contact) => {
  const index = (contact.firstName.charCodeAt(0) + contact.lastName.charCodeAt(0)) % colors.length
  return colors[index]
}

const filteredContacts = computed(() => {
  if (searchQuery.value.trim() === '') {
    return getAllContacts()
  }
  return searchContacts(searchQuery.value)
})

const blockedContacts = computed(() => {
  return getBlockedContacts()
})

const clearSearch = () => {
  searchQuery.value = ''
}

const getInitials = (contact) => {
  return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()
}

const goToContact = (id) => {
  router.push(`/contact/${id}`)
}

const goToNewContact = () => {
  router.push('/contact/new')
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

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.btn-new {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  color: #6366f1;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.btn-new:hover {
  background: #f0f0f0;
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  display: inline;
}

/* Main Content */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* Hero */
.hero {
  text-align: center;
  margin-bottom: 24px;
}

.hero h1 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.hero-subtitle {
  font-size: 14px;
  color: #666;
}

/* Search */
.search-section {
  margin-bottom: 20px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  position: absolute;
  right: 8px;
  padding: 6px;
  background: #eee;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background: #ddd;
}

/* Results Info */
.results-info {
  margin-bottom: 16px;
}

.results-count {
  font-size: 14px;
  color: #666;
}

.no-results {
  font-size: 14px;
  color: #999;
}

/* Contacts Grid */
.contacts-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Contact Card */
.contact-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.contact-card:hover {
  border-color: #6366f1;
  background: #fafafa;
}

.contact-card:focus {
  outline: none;
  border-color: #6366f1;
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.card-email {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-phone {
  font-size: 13px;
  color: #999;
}

.card-arrow {
  color: #ccc;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-illustration {
  margin-bottom: 16px;
  color: #ccc;
}

.empty-illustration svg {
  width: 60px;
  height: 60px;
}

.empty-state h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary:hover {
  background: #4f46e5;
}

/* Blocked Section */
.blocked-section {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.blocked-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px;
  background: #fef3c7;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.blocked-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
}

.chevron {
  color: #92400e;
  transition: transform 0.2s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.blocked-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f3f4f6;
}

.contact-card.blocked {
  background: #fffbeb;
  opacity: 0.9;
}

.contact-card.blocked:hover {
  background: #fef3c7;
}

.blocked-avatar {
  opacity: 0.7;
}

/* Footer */
.footer {
  text-align: center;
  padding: 20px;
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
  .btn-text {
    display: none;
  }
}
</style>
