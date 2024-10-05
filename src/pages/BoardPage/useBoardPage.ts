import { defineStore } from 'pinia'
import { useBulkUpdater, useCreator, useDestroyer, useFinder, useUpdater } from '@vuemodel/core'
import Board from 'src/models/Board'
import Card from 'src/models/Card'
import list from 'src/models/List'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'

export const useBoardPage = defineStore('boardPage', () => {
  const route = useRoute()
  const router = useRouter()
  const boardId = computed(() => route.params.boardId)

  const boardUpdater = useUpdater(Board, {
    autoUpdate: true,
    id: () => boardId.value,
    immediatelyMakeForm: true
  })

  const cardCreator = useCreator(Card, {
    onSuccess () {
      cardsBulkUpdater.makeForms()
    }
  })
  const cardsBulkUpdater = useBulkUpdater(Card, {
    autoUpdate: true
  })
  watch(boardId, async () => {
    boardUpdater.makeForm(boardId.value)
    await cardsBulkUpdater.index()
    cardsBulkUpdater.makeForms()
  }, { immediate: true })

  const listCreator = useCreator(list, {
    onSuccess: async (response) => {
      const listIds = [
        ...(boardUpdater.form.value.list_ids ?? []),
        response.record?.id ?? ''
      ]
      boardUpdater.form.value.list_ids = listIds

      listsBulkUpdater.currentPageIds.value.push(response.record?.id ?? '')
    }
  })
  const listsBulkUpdater = useBulkUpdater(list, {
    autoUpdate: true,
    immediatelyMakeForms: true
  })

  const boardFinder = useFinder(Board, {
    id: () => boardId.value,
    with: { lists: { } },
    onSuccess (response) {
      const listIds = response.record?.lists.map(list => list.id) ?? []
      listsBulkUpdater.makeForms(listIds)
      listsBulkUpdater.currentPageIds.value = listIds

      if (response.record?.list_ids.length !== response.record?.lists.length) {
        boardUpdater.form.value.list_ids?.forEach((listId, index) => {
          if (!listCreator.repo.find(listId)) {
            boardUpdater.form.value.list_ids?.splice(index)
          }
        })
      }
    },
    onError (response) {
      Notify.create({
        message: response.standardErrors[0]?.message,
        color: 'negative'
      })
      router.push({ name: 'home' })
    }
  })

  if (boardId.value) {
    boardFinder.find()
  }

  const listDestroyer = useDestroyer(list, {
    onSuccess (response) {
      const removedIndex = boardUpdater.form.value.list_ids
        ?.findIndex(id => id === response.record?.id) ?? -1

      if (removedIndex !== -1) {
        boardUpdater.form.value.list_ids?.splice(removedIndex, 1)
      }
    }
  })

  const cardDestroyer = useDestroyer(Card)

  return {
    boardUpdater,
    cardCreator,
    cardsBulkUpdater,
    listCreator,
    listsBulkUpdater,
    boardFinder,
    listDestroyer,
    cardDestroyer
  }
})
