<script setup lang="ts">
import { mdiDelete, mdiPlus } from '@quasar/extras/mdi-v7'
import { VueDraggable } from 'vue-draggable-plus'
import { useBoardPage } from './useBoardPage'

const {
  boardUpdater,
  cardCreator,
  cardsBulkUpdater,
  cardGroupCreator,
  cardGroupsBulkUpdater,
  cardGroupDestroyer,
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
      v-if="boardUpdater.form?.card_group_ids"
      v-model="boardUpdater.form.card_group_ids"
      class="row no-wrap"
      direction="horizontal"
    >
      <div
        v-for="cardGroupId in boardUpdater.form.card_group_ids"
        :key="cardGroupId"
        class="q-px-sm"
        style="width: 280px"
      >
        <q-card>
          <div class="row items-center bg-blue-grey-8">
            <q-input
              v-if="cardGroupsBulkUpdater.forms[cardGroupId]"
              v-model="cardGroupsBulkUpdater.forms[cardGroupId].title"
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
              @click="cardGroupDestroyer.destroy(cardGroupId)"
            />
          </div>

          <VueDraggable
            v-if="cardGroupsBulkUpdater.forms[cardGroupId]?.card_ids"
            v-model="cardGroupsBulkUpdater.forms[cardGroupId].card_ids"
            class="full-width"
            group="cardGroup"
          >
            <div
              v-for="cardId in cardGroupsBulkUpdater.forms[cardGroupId].card_ids"
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

                <q-btn
                  :icon="mdiDelete"
                  class="absolute-top-right"
                  size="sm"
                  dense
                  style="margin: -4px -4px 0 0"
                  flat
                  round
                  color="blue-grey-3"
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
              cardGroupsBulkUpdater.forms[cardGroupId].card_ids
                ?.push(cardCreator.record?.id ?? '')
            }"
          />
        </q-card>
      </div>
    </VueDraggable>

    <q-page-sticky
      position="bottom-right"
      :offset="[14,14]"
    >
      <q-btn
        color="primary"
        fab
        :icon="mdiPlus"
        @click="cardGroupCreator.create()"
      />
    </q-page-sticky>
  </q-page>
</template>
