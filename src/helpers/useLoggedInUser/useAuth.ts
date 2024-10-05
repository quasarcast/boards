import { useIndexer } from '@vuemodel/core'
import { useLocalStorage } from '@vueuse/core'
import User from 'models/User'
import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'

export const useAuth = defineStore('auth', () => {
  const usersIndexer = useIndexer(User, {
    immediate: true,
  })

  const users = computed(() => usersIndexer.repo.all())

  const selectedUserId = useLocalStorage('selectedUserId', '')
  const userRepo = useRepo(User)

  const user = computed(() => {
    return userRepo.find(selectedUserId.value)
  })

  const loggedIn = computed(() => {
    return !!user.value
  })

  async function logout () {
    selectedUserId.value = ''
  }

  return {
    selectedUserId,
    users,
    user,
    loggedIn,
    logout,
  }
})
