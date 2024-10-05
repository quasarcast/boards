<script lang="ts" setup>
import { useIndexer } from '@vuemodel/core'
import Project from 'src/models/Project'

const projectsIndexer = useIndexer(Project)
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div
        v-for="project in projectsIndexer.records.value"
        :key="project.id"
        class="col-sm-12 col-md-4 col-lg-3"
      >
        <q-card>
          <q-card-section>
            {{ project.name }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
