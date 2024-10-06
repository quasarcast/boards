import { useBulkUpdater, useCreator, useDestroyer } from '@vuemodel/core'
import { Model } from 'pinia-orm'
import { PiniaOrmForm } from 'pinia-orm-helpers'
import { MaybeRefOrGetter, reactive, ref } from 'vue'

export function useModelCollection<
  T extends typeof Model
> (ModelClass: T, options?: {
  immediatelyMakeForms?: MaybeRefOrGetter<boolean>
  createMerge?: MaybeRefOrGetter<PiniaOrmForm<InstanceType<T>>>
}) {
  const showCreateForm = ref(false)
  const creator = useCreator(ModelClass, {
    merge: options?.createMerge,
    onSuccess () {
      showCreateForm.value = false
      bulkUpdater.index()
    }
  })

  const bulkUpdater = useBulkUpdater(ModelClass, {
    autoUpdate: true,
    autoUpdateDebounce: 300,
    onSuccess (response) {
      console.log('updated', response)
    },
    immediatelyMakeForms: options?.immediatelyMakeForms
  })

  bulkUpdater.pagination.value.recordsPerPage = 2

  const destroyer = useDestroyer(ModelClass)
  return reactive({
    // Create
    creator,
    createForm: creator.form,
    create: creator.create,
    creating: creator.creating,
    showCreateForm,

    // Index
    indexer: bulkUpdater.indexer,
    indexing: bulkUpdater.indexer.indexing,
    index: bulkUpdater.index,
    records: bulkUpdater.records,

    // Bulk Update
    updateForms: bulkUpdater.formsWithMeta,
    bulkUpdater,

    // Destroy
    destroy: destroyer.destroy,
    destroying: destroyer.destroying,
    destroyer,

    ModelClass
  })
}
