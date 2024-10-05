<script lang="ts" setup>
import { mdiBook, mdiBookPlus, mdiDelete } from '@quasar/extras/mdi-v7'
import { useMainLayout } from 'src/layouts/useMainLayout'

const mainLayout = useMainLayout()
</script>

<template>
  <q-page
    padding
  >
    <h1 class="q-mt-md">
      Projects
    </h1>

    <div
      v-if="mainLayout.projectsIndexer.records?.length"
      class="row q-col-gutter-md"
    >
      <div
        v-for="project in mainLayout.projectsIndexer.records"
        :key="project.id"
        class="col-sm-12 col-md-4 col-lg-3"
      >
        <q-card
          class="cursor-pointer"
          :class="[
            mainLayout.projectId === project.id ?
              'bg-primary text-white' :
              ''
          ]"
          @click="() => {
            mainLayout.projectId = project.id
            mainLayout.leftDrawerOpen = true
          }"
        >
          <q-card-section class="row justify-between items-center">
            {{ project.name }}

            <q-btn
              flat
              round
              :icon="mdiDelete"
              :color="mainLayout.projectId === project.id ? 'blue-grey-1' : 'blue-grey-4'"
              :loading="mainLayout.boardDestroyer.destroying === project.id"
              @click="mainLayout.boardDestroyer.destroy()"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-mt-xl">
      <q-btn
        label="Add Project"
        no-caps
        :icon="mdiBookPlus"
        color="primary"
        @click="mainLayout.createProject()"
      />
    </div>
  </q-page>
</template>
