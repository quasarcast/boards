import { defineStore } from 'pinia'
import { useCreator, useDestroyer, useIndexer } from '@vuemodel/core'
import { useLocalStorage } from '@vueuse/core'
import { Dialog } from 'quasar'
import { clearIndexedDb } from 'src/helpers/clearIndexedDb'
import Board from 'src/models/Board'
import Project from 'src/models/Project'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useMainLayout = defineStore('mainLayout', () => {
  const router = useRouter()

  const leftDrawerOpen = ref(false)

  const boardsIndexer = useIndexer(Board, { immediate: true })
  const boardCreator = useCreator(Board, {
    onSuccess () {
      boardsIndexer.index()
    }
  })
  const boardDestroyer = useDestroyer(Board, {
    onSuccess () {
      router.push({ name: 'home' })
    }
  })

  function createBoard () {
    Dialog.create({
      title: 'Create A Board',
      cancel: true,
      prompt: {
        model: '',
        filled: true
      }
    }).onOk(async (title) => {
      await boardCreator.create({ title })
      router.push({ name: 'board', params: { boardId: boardCreator.record.value?.id ?? '' } })
    })
  }

  function createProject () {
    Dialog.create({
      title: 'Create A Project',
      cancel: true,
      prompt: {
        model: '',
        filled: true
      }
    }).onOk(async (name) => {
      await projectCreator.create({ name })
      projectId.value = projectCreator.record.value?.id ?? ''
      projectsIndexer.index()
      leftDrawerOpen.value = true
    })
  }

  const projectCreator = useCreator(Project)
  const projectsIndexer = useIndexer(Project, {
    immediate: true
  })
  const projectDestroyer = useDestroyer(Project, {
    onSuccess: async () => {
      await router.push({ name: 'home' })
      projectId.value = ''
    }
  })
  const selectedProject = computed(() => {
    return projectsIndexer.repo.find(projectId.value)
  })

  const projectId = useLocalStorage('projectId', '')
  watch(projectId, async () => {
    await router.push({ name: 'home' })
    boardsIndexer.index()
  })

  async function clearDatabase () {
    await Promise.all([
      clearIndexedDb(),
      router.push({ name: 'home' })
    ])

    window.location.reload()
  }

  return {
    router,
    leftDrawerOpen,
    boardsIndexer,
    boardCreator,
    boardDestroyer,
    createBoard,
    createProject,
    projectCreator,
    projectDestroyer,
    projectsIndexer,
    projectId,
    selectedProject,
    clearDatabase
  }
})
