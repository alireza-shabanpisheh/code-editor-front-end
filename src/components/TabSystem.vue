<template>
  <div class="tabs-container bg-gray-900 border-b border-gray-700">
    <div 
      v-if="openFiles.length === 0"
      class="h-10 flex items-center justify-center text-gray-500 text-sm"
    >
      No files open
    </div>
    
    <div 
      v-else
      class="flex h-10 overflow-x-auto"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <TabItem
        v-for="file in openFiles"
        :key="file.id"
        :file="file"
        :is-active="file.id === activeFileId"
        @click="handleTabClick"
        @close="handleTabClose"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import TabItem from './TabItem.vue'

const editorStore = useEditorStore()

const openFiles = computed(() => editorStore.openFiles)
const activeFileId = computed(() => editorStore.activeFileId)

function handleTabClick(fileId: string) {
  editorStore.activeFileId = fileId
}

function handleTabClose(fileId: string) {
  editorStore.closeFile(fileId)
}
</script>

<style scoped>
.tabs-container::-webkit-scrollbar {
  display: none;
}
</style>