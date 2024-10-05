import { boot } from 'quasar/wrappers'
import { createVueModel } from '@vuemodel/core'
import { createPiniaLocalStorage, piniaLocalVueModelDriver } from '@vuemodel/pinia-local-storage'

export default boot(({ app, store }) => {
  const piniaLocalStorage = createPiniaLocalStorage({
    frontStore: store
  })

  const vueModel = createVueModel({
    default: 'local',
    drivers: {
      local: {
        driver: piniaLocalVueModelDriver,
        config: {
          scopes: {
            scopeToProject (context) {
              const ModelClass = context?.ModelClass
              const hasProjectIdField = ModelClass ? !!(new ModelClass()).$fields().project_id : null
              if (hasProjectIdField) {
                return {
                  filters: {
                    project_id: { equals: localStorage.getItem('projectId') ?? '' }
                  }
                }
              }
              return {
              }
            }
          },
          hooks: {
            creating: [
              (ModelClass, payload) => {
                const hasProjectIdField = ModelClass ? !!(new ModelClass()).$fields().project_id : null

                if (hasProjectIdField) {
                  payload.form.project_id = localStorage.getItem('projectId')
                }
              }
            ]
          },
          globallyAppliedScopes: ['scopeToProject'],
          notifyOnError: {
            bulkUpdate: true,
            create: true,
            destroy: true,
            find: true,
            index: true,
            sync: true,
            update: true
          },
          pinia: store
        }
      }
    }
  })

  app.use(vueModel)
  app.use(piniaLocalStorage)
})
