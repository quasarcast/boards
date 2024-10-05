import { defineStore } from 'pinia'
import { useBulkUpdater, useCreator, useDestroyer, useFinder, useUpdater } from '@vuemodel/core'
import Board from 'src/models/Board'
import Card from 'src/models/Card'
import CardGroup from 'src/models/CardGroup'
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

  const cardGroupCreator = useCreator(CardGroup, {
    onSuccess: async (response) => {
      const cardGroupIds = [
        ...(boardUpdater.form.value.card_group_ids ?? []),
        response.record?.id ?? ''
      ]
      boardUpdater.form.value.card_group_ids = cardGroupIds

      cardGroupsBulkUpdater.currentPageIds.value.push(response.record?.id ?? '')
    }
  })
  const cardGroupsBulkUpdater = useBulkUpdater(CardGroup, {
    autoUpdate: true,
    immediatelyMakeForms: true
  })

  const boardFinder = useFinder(Board, {
    id: () => boardId.value,
    with: { card_groups: { } },
    onSuccess (response) {
      const cardGroupIds = response.record?.card_groups.map(group => group.id) ?? []
      cardGroupsBulkUpdater.makeForms(cardGroupIds)
      cardGroupsBulkUpdater.currentPageIds.value = cardGroupIds

      if (response.record?.card_group_ids.length !== response.record?.card_groups.length) {
        boardUpdater.form.value.card_group_ids?.forEach((cardGroupId, index) => {
          if (!cardGroupCreator.repo.find(cardGroupId)) {
            boardUpdater.form.value.card_group_ids?.splice(index)
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

  const cardGroupDestroyer = useDestroyer(CardGroup, {
    onSuccess (response) {
      const removedIndex = boardUpdater.form.value.card_group_ids
        ?.findIndex(id => id === response.record?.id) ?? -1

      if (removedIndex !== -1) {
        boardUpdater.form.value.card_group_ids?.splice(removedIndex, 1)
      }
    }
  })

  const cardDestroyer = useDestroyer(Card)

  return {
    boardUpdater,
    cardCreator,
    cardsBulkUpdater,
    cardGroupCreator,
    cardGroupsBulkUpdater,
    boardFinder,
    cardGroupDestroyer,
    cardDestroyer
  }
})
