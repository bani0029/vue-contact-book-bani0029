import { ref, watch } from 'vue'

const STORAGE_KEY = 'contact-book-contacts'

const contacts = ref([])
const searchQuery = ref('')

const loadContacts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      contacts.value = JSON.parse(stored)
    } else {
      contacts.value = [
        {
          id: '1',
          firstName: 'Rezza',
          lastName: 'Shrestha',
          email: 'rezza@example.com',
          phone: '343-558-7816',
          address: '',
          company: '',
          notes: '',
          photoUrl: '',
          blocked: false,
          lastContacted: new Date().toISOString()
        },
        {
          id: '2',
          firstName: 'Bishal',
          lastName: 'Rai',
          email: 'bishal@example.com',
          phone: '343-363-3631',
          address: '',
          company: '',
          notes: '',
          photoUrl: '',
          blocked: false,
          lastContacted: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          firstName: 'Suman',
          lastName: 'Gurung',
          email: 'suman@example.com',
          phone: '976-535-3375',
          address: '',
          company: '',
          notes: '',
          photoUrl: '',
          blocked: false,
          lastContacted: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '4',
          firstName: 'Aunty',
          lastName: 'Thapa',
          email: 'aunty@example.com',
          phone: '456-789-0123',
          address: '',
          company: '',
          notes: '',
          photoUrl: '',
          blocked: false,
          lastContacted: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: '5',
          firstName: 'Manoj',
          lastName: 'Baniya',
          email: 'manoj@example.com',
          phone: '234-567-8901',
          address: '',
          company: '',
          notes: '',
          photoUrl: '',
          blocked: false,
          lastContacted: new Date(Date.now() - 345600000).toISOString()
        },
        {
          id: '6',
          firstName: 'Mahesh',
          lastName: 'Karki',
          email: 'mahesh@example.com',
          phone: '345-678-9012',
          address: '',
          company: '',
          notes: '',
          photoUrl: '',
          blocked: false,
          lastContacted: new Date(Date.now() - 432000000).toISOString()
        }
      ]
      saveToStorage()
    }
  } catch (error) {
    contacts.value = []
  }
}

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts.value))
  } catch (error) {
  }
}

watch(contacts, () => {
  saveToStorage()
}, { deep: true })

loadContacts()

export function useContacts() {
  const getAllContacts = (includeBlocked = false) => {
    const filtered = includeBlocked 
      ? [...contacts.value]
      : contacts.value.filter(c => !c.blocked)
    
    return filtered.sort((a, b) => {
      const lastNameA = a.lastName.toLowerCase()
      const lastNameB = b.lastName.toLowerCase()
      if (lastNameA < lastNameB) return -1
      if (lastNameA > lastNameB) return 1
      const firstNameA = a.firstName.toLowerCase()
      const firstNameB = b.firstName.toLowerCase()
      return firstNameA.localeCompare(firstNameB)
    })
  }

  const getBlockedContacts = () => {
    return contacts.value
      .filter(c => c.blocked)
      .sort((a, b) => {
        const lastNameA = a.lastName.toLowerCase()
        const lastNameB = b.lastName.toLowerCase()
        if (lastNameA < lastNameB) return -1
        if (lastNameA > lastNameB) return 1
        return a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase())
      })
  }

  const getContactById = (id) => {
    return contacts.value.find(contact => contact.id === id)
  }

  const searchContacts = (query, includeBlocked = false) => {
    if (!query || query.trim() === '') {
      return getAllContacts(includeBlocked)
    }
    
    const lowerQuery = query.toLowerCase().trim()
    const filtered = contacts.value.filter(contact => {
      if (!includeBlocked && contact.blocked) return false
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
      const reverseName = `${contact.lastName} ${contact.firstName}`.toLowerCase()
      return fullName.includes(lowerQuery) || 
             reverseName.includes(lowerQuery) ||
             contact.firstName.toLowerCase().includes(lowerQuery) ||
             contact.lastName.toLowerCase().includes(lowerQuery)
    })
    
    return filtered.sort((a, b) => {
      const lastNameA = a.lastName.toLowerCase()
      const lastNameB = b.lastName.toLowerCase()
      if (lastNameA < lastNameB) return -1
      if (lastNameA > lastNameB) return 1
      return a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase())
    })
  }

  const addContact = (contactData) => {
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      blocked: false
    }
    contacts.value.push(newContact)
    return newContact
  }

  const updateContact = (id, contactData) => {
    const index = contacts.value.findIndex(contact => contact.id === id)
    if (index !== -1) {
      contacts.value[index] = {
        ...contacts.value[index],
        ...contactData
      }
      return contacts.value[index]
    }
    return null
  }

  const deleteContact = (id) => {
    const index = contacts.value.findIndex(contact => contact.id === id)
    if (index !== -1) {
      contacts.value.splice(index, 1)
      return true
    }
    return false
  }

  const blockContact = (id) => {
    const contact = contacts.value.find(c => c.id === id)
    if (contact) {
      contact.blocked = true
      return true
    }
    return false
  }

  const unblockContact = (id) => {
    const contact = contacts.value.find(c => c.id === id)
    if (contact) {
      contact.blocked = false
      return true
    }
    return false
  }

  const getRecentContacts = (limit = 3) => {
    return contacts.value
      .filter(c => !c.blocked && c.lastContacted)
      .sort((a, b) => new Date(b.lastContacted) - new Date(a.lastContacted))
      .slice(0, limit)
  }

  const updateLastContacted = (id) => {
    const contact = contacts.value.find(c => c.id === id)
    if (contact) {
      contact.lastContacted = new Date().toISOString()
      return true
    }
    return false
  }

  const isContactBlocked = (id) => {
    const contact = contacts.value.find(c => c.id === id)
    return contact ? contact.blocked : false
  }

  return {
    contacts,
    searchQuery,
    getAllContacts,
    getBlockedContacts,
    getContactById,
    searchContacts,
    addContact,
    updateContact,
    deleteContact,
    blockContact,
    unblockContact,
    isContactBlocked,
    getRecentContacts,
    updateLastContacted
  }
}
