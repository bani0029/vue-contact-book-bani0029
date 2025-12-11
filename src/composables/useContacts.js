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
          firstName: 'Manoj',
          lastName: 'Tamang',
          email: 'buddhayonzan456@gmail.com',
          phone: '3435587816',
          address: '',
          company: '',
          notes: '',
          blocked: false
        },
        {
          id: '2',
          firstName: 'Nirajan',
          lastName: 'Khadka',
          email: 'khadkanijan2055@gmail.com',
          phone: '3433633631',
          address: '',
          company: '',
          notes: '',
          blocked: false
        },
        {
          id: '3',
          firstName: 'Meenu',
          lastName: 'Thokar',
          email: 'thokarmeenu@gmail.com',
          phone: '9765353375',
          address: '',
          company: '',
          notes: '',
          blocked: false
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
    isContactBlocked
  }
}
