<script setup lang="ts">
import { mdiDelete, mdiPlus } from '@quasar/extras/mdi-v7'
import { useCreator, useDestroyer, useIndexer } from '@vuemodel/core'
import { useLocalStorage } from '@vueuse/core'
import { Dialog } from 'quasar'
import Board from 'src/models/Board'
import Project from 'src/models/Project'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const leftDrawerOpen = ref(false)

const boardsIndexer = useIndexer(Board, { immediate: true })
const boardCreator = useCreator(Board)
const boardDestroyer = useDestroyer(Board)

function createBoard () {
  Dialog.create({
    title: 'Create A Board',
    cancel: true,
    prompt: {
      model: '',
      filled: true
    }
  }).onOk(async (title) => {
    await boardCreator.create({ title })
    router.push({ name: 'board', params: { boardId: boardCreator.record.value?.id ?? '' } })
  })
}

function createProject () {
  Dialog.create({
    title: 'Create A Project',
    cancel: true,
    prompt: {
      model: '',
      filled: true
    }
  }).onOk(async (name) => {
    await projectCreator.create({ name })
    projectId.value = projectCreator.record.value?.id ?? ''
  })
}

const projectCreator = useCreator(Project)
const projectsIndexer = useIndexer(Project, { immediate: true })

const projectId = useLocalStorage('projectId', '')
watch(projectId, async () => {
  await router.push({ name: 'home' })
  window.location.reload()
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-white text-blue-grey-9"
      elevated
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Boards
        </q-toolbar-title>

        <q-select
          v-model="projectId"
          class="q-mr-sm"
          :options="projectsIndexer.records.value"
          option-label="name"
          option-value="id"
          filled
          dense
          label="project"
          map-options
          emit-value
        />

        <q-btn
          label="Create Project"
          flat
          @click="createProject()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
          class="row items-center"
        >
          Boards
          <q-space />
          <q-btn
            size="sm"
            flat
            round
            :icon="mdiPlus"
            @click="createBoard()"
          />
        </q-item-label>

        <q-item
          v-for="board in boardsIndexer.records.value"
          :key="board.id"
          :to="{ name: 'board', params: { boardId: board.id } }"
        >
          <q-item-section>
            {{ board.title }}
          </q-item-section>

          <q-item-section side>
            <q-btn
              size="sm"
              round
              flat
              color="blue-grey-3"
              :icon="mdiDelete"
              @click.stop="boardDestroyer.destroy(board.id)"
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
