<script setup lang="ts">
import { mdiBook, mdiDelete, mdiDotsVertical, mdiPlus, mdiDeleteForever, mdiBookPlus, mdiShapeSquarePlus, mdiPencil } from '@quasar/extras/mdi-v7'
import { useMainLayout } from './useMainLayout'

const mainLayout = useMainLayout()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-white text-blue-grey-9"
      elevated
    >
      <q-toolbar>
        <q-btn
          v-if="mainLayout.selectedProject"
          flat
          dense
          round
          icon="menu"
          color="primary"
          aria-label="Menu"
          @click="mainLayout.leftDrawerOpen = !mainLayout.leftDrawerOpen"
        />

        <q-toolbar-title>
          Boards
        </q-toolbar-title>

        <q-select
          v-if="mainLayout.projectsIndexer.records?.length"
          v-model="mainLayout.selectedProject"
          class="q-mr-sm"
          :options="mainLayout.projectsIndexer.records"
          option-label="name"
          option-value="id"
          filled
          dense
          label="project"
          map-options
          emit-value
        />

        <q-btn
          :icon="mdiDotsVertical"
          round
          color="primary"
          flat
        >
          <q-menu auto-close>
            <q-btn
              flat
              class="full-width"
              color="primary"
              label="Projects"
              no-caps
              :icon="mdiBook"
              align="left"
              :to="{ name: 'home' }"
            />

            <q-btn
              flat
              class="full-width"
              label="Create Project"
              color="primary"
              no-caps
              align="left"
              :icon="mdiBookPlus"
              @click="mainLayout.createProject()"
            />

            <q-btn
              flat
              class="full-width"
              color="primary"
              label="Clear All"
              no-caps
              :icon="mdiDeleteForever"
              align="left"
              @click="mainLayout.clearDatabase()"
            />
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="mainLayout.selectedProject"
      v-model="mainLayout.leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
          class="row items-center"
        >
          {{ mainLayout.selectedProject?.name }} - Boards
          <q-space />

          <q-btn
            size="sm"
            flat
            round
            :icon="mdiPlus"
            @click="mainLayout.createBoard()"
          />
        </q-item-label>

        <q-item
          v-for="board in mainLayout.boardsIndexer.records"
          :key="board.id"
          :to="{ name: 'board', params: { boardId: board.id } }"
        >
          <q-item-section>
            {{ board.title }}

            <q-menu
              auto-close
              context-menu
            >
              <q-list>
                <q-item
                  clickable
                  @click="mainLayout.updateBoard(board.id)"
                >
                  <q-item-section
                    avatar
                    side
                  >
                    <q-icon
                      color="blue-grey-3"
                      :name="mdiPencil"
                    />
                  </q-item-section>
                  <q-item-section>
                    Update
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  @click="mainLayout.boardDestroyer.destroy(board.id)"
                >
                  <q-item-section
                    avatar
                    side
                  >
                    <q-icon
                      color="blue-grey-3"
                      :name="mdiDelete"
                    />
                  </q-item-section>
                  <q-item-section>
                    Delete
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-btn
              v-if="!mainLayout.boardsIndexer.records.length"
              color="primary"
              :icon="mdiShapeSquarePlus"
              label="Add Board"
              @click="mainLayout.createBoard()"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
