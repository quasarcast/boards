export function clearIndexedDb() {
  indexedDB.databases().then((r) => {
    for (var i = 0; i < r.length; i++) {
      const database = r[i].name
      if(database) {
        indexedDB.deleteDatabase(database)
      }
    };
  })
}
