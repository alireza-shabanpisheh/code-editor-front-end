<template>
  <div class="file-explorer bg-gray-800 text-white w-64 h-full overflow-y-auto border-r border-gray-700">
    <div class="p-3 border-b border-gray-700">
      <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">Explorer</h3>
    </div>
    
    <div class="p-2">
      <div class="mb-2">
        <button 
          @click="createNewFile"
          class="w-full text-left text-xs text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors"
        >
          + New File
        </button>
      </div>
      
      <FileTreeNode 
        v-for="node in fileTree" 
        :key="node.id"
        :node="node"
        :level="0"
        @open-file="handleOpenFile"
        @toggle-folder="handleToggleFolder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import FileTreeNode from './FileTreeNode.vue'

const editorStore = useEditorStore()

const fileTree = computed(() => editorStore.fileTree)

function handleOpenFile(fileId: string) {
  editorStore.openFile(fileId)
}

function handleToggleFolder(folderId: string) {
  editorStore.toggleFolder(folderId)
}

function createNewFile() {
  const fileName = prompt('Enter file name (with extension .html, .css, or .js):')
  if (!fileName) return

  const extension = fileName.split('.').pop()?.toLowerCase()
  if (!extension || !['html', 'css', 'js'].includes(extension)) {
    alert('Please use .html, .css, or .js extension')
    return
  }

  const fileType = extension as 'html' | 'css' | 'js'
  const newFileId = editorStore.createNewFile(fileName, fileType)
  editorStore.openFile(newFileId)
}
</script>

<style scoped>
.file-explorer {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #1F2937;
}

.file-explorer::-webkit-scrollbar {
  width: 6px;
}

.file-explorer::-webkit-scrollbar-track {
  background: #1F2937;
}

.file-explorer::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.file-explorer::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>