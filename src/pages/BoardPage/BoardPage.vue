<script setup lang="ts">
import { mdiDelete, mdiPlus, mdiShapeRectanglePlus } from '@quasar/extras/mdi-v7'
import { VueDraggable } from 'vue-draggable-plus'
import { useBoardPage } from './useBoardPage'

const {
  boardUpdater,
  cardCreator,
  cardsBulkUpdater,
  listCreator,
  listsBulkUpdater,
  listDestroyer,
  cardDestroyer
} = useBoardPage()
</script>

<template>
  <q-page
    padding
    :style-fn="(offset, height) => {
      return {
        height: `calc(${height}px - ${offset}px)`
      }
    }"
    class="row justify-start overflow-auto full-width no-wrap"
  >
    <VueDraggable
      v-if="boardUpdater.form?.list_ids"
      v-model="boardUpdater.form.list_ids"
      class="row no-wrap"
      direction="horizontal"
    >
      <div
        v-for="listId in boardUpdater.form.list_ids"
        :key="listId"
        class="q-px-sm"
        style="width: 280px"
      >
        <q-card>
          <div class="row items-center bg-blue-grey-8">
            <q-input
              v-if="listsBulkUpdater.forms[listId]"
              v-model="listsBulkUpdater.forms[listId].title"
              class="col q-pl-sm"
              dark
              dense
              borderless
            />
            <q-btn
              :icon="mdiDelete"
              color="grey-3"
              flat
              round
              size="sm"
              class="q-mx-xs"
              @click="listDestroyer.destroy(listId)"
            />
          </div>

          <VueDraggable
            v-if="listsBulkUpdater.forms[listId]?.card_ids"
            v-model="listsBulkUpdater.forms[listId].card_ids"
            class="full-width"
            group="list"
          >
            <div
              v-for="cardId in listsBulkUpdater.forms[listId].card_ids"
              :key="cardId"
            >
              <q-card
                v-if="cardsBulkUpdater.forms[cardId]"
                class="q-ma-xs shadow-1 q-px-sm relative-position"
              >
                <q-input
                  v-model="cardsBulkUpdater.forms[cardId].title"
                  borderless
                  dense
                  type="textarea"
                  autogrow
                />

                <q-space />

                <q-btn
                  :icon="mdiDelete"
                  class="absolute-top-right"
                  size="sm"
                  dense
                  style="margin: -4px -4px 0 0"
                  flat
                  round
                  color="blue-grey-3"
                  @click="cardDestroyer.destroy(cardId)"
                />
              </q-card>
            </div>
          </VueDraggable>

          <q-btn
            :icon="mdiPlus"
            class="full-width"
            flat
            @click="async () => {
              await cardCreator.create()
              listsBulkUpdater.forms[listId].card_ids
                ?.push(cardCreator.record?.id ?? '')
            }"
          />
        </q-card>
      </div>
    </VueDraggable>

    <div class="q-ml-md">
      <q-btn
        color="primary"
        :icon="mdiShapeRectanglePlus"
        label="Add List"
        @click="listCreator.create()"
      />
    </div>

    <q-page-sticky
      position="bottom-right"
      :offset="[14,14]"
    >
      <q-btn
        color="primary"
        fab
        :icon="mdiShapeRectanglePlus"
        @click="listCreator.create()"
      />
    </q-page-sticky>
  </q-page>
</template>
