export function storeFile (blob: Blob, name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open('files', 5)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' })
      }
    }

    request.onsuccess = (event: Event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
      const transaction: IDBTransaction = db.transaction('files', 'readwrite')
      const store: IDBObjectStore = transaction.objectStore('files')

      const file = { id: name, data: blob }
      const putRequest: IDBRequest<any> = store.put(file)

      putRequest.onsuccess = () => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
    }

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}

export function getFileURL (fileId: string): Promise<{ url: string, file: File } | null> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open('files', 5)

    request.onsuccess = (event: Event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
      const transaction: IDBTransaction = db.transaction('files', 'readonly')
      const store: IDBObjectStore = transaction.objectStore('files')

      const getRequest: IDBRequest<any> = store.get(fileId)

      getRequest.onsuccess = () => {
        const result = getRequest.result
        if (result && result.data) {
          const url = URL.createObjectURL(result.data)
          resolve({ url, file: result.data })
        } else {
          resolve(null) // If file is not found
        }
      }

      getRequest.onerror = () => {
        reject(getRequest.error)
      }
    }

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}
