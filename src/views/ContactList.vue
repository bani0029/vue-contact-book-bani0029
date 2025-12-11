<template>
  <div class="page-container">
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo">
          <h1 class="logo-text">CONTACTS</h1>
        </div>
        <button @click="goToNewContact" class="btn-new">
          <span class="btn-icon">+</span>
          <span class="btn-text">New Contact</span>
        </button>
      </div>
    </nav>

    <main class="main-content">
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

      <!-- Recent Contacts (only when not searching) -->
      <div v-if="!searchQuery && recentContacts.length > 0" class="recent-section">
        <h2 class="section-title">Recent</h2>
        <div class="recent-grid">
          <div
            v-for="contact in recentContacts"
            :key="'recent-' + contact.id"
            class="recent-contact"
            @click="goToContact(contact.id)"
          >
            <div class="recent-avatar" :style="{ background: getAvatarColor(contact) }">
              <img v-if="contact.photoUrl" :src="contact.photoUrl" alt="" class="avatar-img" />
              <span v-else>{{ getInitials(contact) }}</span>
            </div>
            <p class="recent-name">{{ contact.firstName }}</p>
          </div>
        </div>
      </div>

      <!-- All Contacts Section -->
      <div v-if="filteredContacts.length > 0" class="contacts-section">
        <h2 class="section-title">
          {{ searchQuery ? `Results (${filteredContacts.length})` : 'All Contacts' }}
        </h2>

        <!-- Contacts List with Alphabetical Grouping -->
        <div v-for="(group, letter) in groupedContacts" :key="letter" class="contact-group">
          <div class="alphabet-header">{{ letter }}</div>
          <div class="contacts-list">
            <article
              v-for="contact in group"
              :key="contact.id"
              :class="['contact-card', { 'blocked-contact': contact.blocked }]"
            >
              <div class="contact-main" @click="goToContact(contact.id)">
                <div class="card-avatar" :style="{ background: getAvatarColor(contact) }">
                  <img v-if="contact.photoUrl" :src="contact.photoUrl" alt="" class="avatar-img" />
                  <span v-else>{{ getInitials(contact) }}</span>
                </div>
                <div class="card-content">
                  <h3 class="card-name">
                    {{ contact.firstName }} {{ contact.lastName }}
                    <span v-if="contact.blocked" class="blocked-badge">Blocked</span>
                  </h3>
                  <p class="card-email">{{ contact.email }}</p>
                </div>
              </div>
              <div v-if="contact.blocked" class="card-actions">
                <button
                  @click.stop="toggleBlock(contact)"
                  class="btn-unblock"
                  title="Unblock"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                  <span>Unblock</span>
                </button>
              </div>
            </article>
          </div>
        </div>
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

      <!-- No Search Results -->
      <div v-else-if="searchQuery" class="empty-state">
        <div class="empty-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <h2>No results found</h2>
        <p>No contacts match "{{ searchQuery }}"</p>
        <button @click="clearSearch" class="btn-secondary">Clear Search</button>
      </div>

      <!-- Blocked Contacts Section -->
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
const { 
  searchContacts, 
  getAllContacts, 
  getBlockedContacts,
  getRecentContacts,
  blockContact,
  unblockContact
} = useContacts()

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
    return getAllContacts(true) // Include blocked contacts
  }
  return searchContacts(searchQuery.value, true) // Include blocked contacts in search
})

const groupedContacts = computed(() => {
  const contacts = filteredContacts.value
  const groups = {}
  
  contacts.forEach(contact => {
    const firstLetter = contact.lastName.charAt(0).toUpperCase()
    if (!groups[firstLetter]) {
      groups[firstLetter] = []
    }
    groups[firstLetter].push(contact)
  })
  
  // Sort groups alphabetically
  const sortedGroups = {}
  Object.keys(groups).sort().forEach(key => {
    sortedGroups[key] = groups[key]
  })
  
  return sortedGroups
})

const recentContacts = computed(() => {
  return getRecentContacts(4)
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

const toggleBlock = (contact) => {
  if (contact.blocked) {
    unblockContact(contact.id)
  } else {
    blockContact(contact.id)
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Navbar */
.navbar {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-content {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 22px;
  font-weight: 900;
  color: white;
  letter-spacing: 1px;
  margin: 0;
}

.btn-new {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: white;
  color: #1e293b;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.btn-new:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-icon {
  font-size: 18px;
}

/* Main Content */
.main-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 16px 40px;
}

/* Search */
.search-section {
  margin-bottom: 24px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 48px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  background: white;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
}

.clear-btn {
  position: absolute;
  right: 12px;
  padding: 6px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e0e0e0;
}

/* Section Title */
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding: 0 4px;
}

/* Recent Contacts */
.recent-section {
  margin-bottom: 32px;
}

.recent-grid {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 8px 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.recent-grid::-webkit-scrollbar {
  display: none;
}

.recent-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 72px;
  cursor: pointer;
  transition: transform 0.2s;
}

.recent-contact:hover {
  transform: scale(1.05);
}

.recent-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

.recent-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
  max-width: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* All Contacts Section */
.contacts-section {
  margin-bottom: 24px;
}

.contact-group {
  margin-bottom: 28px;
}

.alphabet-header {
  font-size: 16px;
  font-weight: 700;
  color: #64748b;
  padding: 4px 8px;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

/* Contacts List */
.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Contact Card */
.contact-card {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.contact-card.blocked-contact {
  background: #fef2f2;
  opacity: 0.85;
}

.contact-card.blocked-contact:hover {
  background: #fee2e2;
}

.contact-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  padding: 12px 16px;
  cursor: pointer;
}

.contact-card:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.card-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 17px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
}

.blocked-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.card-email {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-actions {
  padding: 12px 16px 12px 0;
  display: flex;
  gap: 8px;
}

.btn-unblock {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-unblock:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn-unblock svg {
  width: 16px;
  height: 16px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-illustration {
  margin-bottom: 24px;
  color: #ccc;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Footer */
.footer {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
  font-size: 13px;
  border-top: none;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

/* Responsive */
@media (max-width: 640px) {
  .nav-content {
    height: 56px;
  }
  
  .btn-text {
    display: none;
  }
  
  .main-content {
    padding: 16px 12px 32px;
  }
  
  .recent-grid {
    gap: 12px;
  }
  
  .recent-contact {
    min-width: 64px;
  }
  
  .recent-avatar {
    width: 56px;
    height: 56px;
    font-size: 18px;
  }
}
</style>
