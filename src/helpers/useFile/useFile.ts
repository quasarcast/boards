import { computed, ref, watch } from 'vue'
import { getFileURL, storeFile } from './storeFile'
import { uid } from 'quasar'
import { downloadFileFromBlob } from './downloadFileFromBlob'

export function useFile () {
  const storing = ref(false)
  const file = ref<File>()
  const id = ref()
  const fileUrl = ref<string | null>(null)

  const internalFile = ref<File>()

  async function onIdChange () {
    let foundFileUrl: string | null
    try {
      const response = await getFileURL(id.value)
      foundFileUrl = response?.url ?? ''
      internalFile.value = response?.file
    } catch (error) {
      return
    }
    fileUrl.value = foundFileUrl
  }

  watch(id, async () => {
    await onIdChange()
  })

  async function store () {
    if (!file.value) return

    storing.value = true

    if (!id.value) id.value = uid()

    await storeFile(file.value, id.value)
    const response = await getFileURL(id.value)
    const fileUrl = response?.url

    storing.value = false

    return { url: fileUrl, id: id.value }
  }

  async function download (idParam?: string) {
    if (idParam) {
      id.value = idParam
      await onIdChange()
    }

    if (!fileUrl.value || !internalFile.value) return

    downloadFileFromBlob(fileUrl.value, name.value)
  }

  const name = computed(() => {
    return internalFile.value?.name ?? ''
  })

  const type = computed(() => {
    return internalFile.value?.type
  })

  return reactive({
    storing,
    file,
    store,
    url: fileUrl,
    download,
    id,
    name,
    type,
  })
}
