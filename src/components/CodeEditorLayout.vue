<template>
  <div class="code-editor-layout h-screen flex flex-col bg-gray-900">
    <!-- Top Menu Bar (Optional) -->
    <div class="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-white font-semibold text-lg">Code Editor</h1>
        <div class="flex items-center space-x-2 text-sm text-gray-400">
          <span>Vue.js</span>
          <span>•</span>
          <span>TypeScript</span>
          <span>•</span>
          <span>Tailwind CSS</span>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="createNewFile"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          New File
        </button>
        <button
          @click="saveAll"
          :disabled="!hasUnsavedFiles"
          class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Save All
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar - File Explorer -->
      <div class="flex-shrink-0">
        <FileExplorer />
      </div>

      <!-- Main Editor Area -->
      <div class="flex-1 flex flex-col">
        <!-- Tabs -->
        <TabSystem />
        
        <!-- Editor -->
        <CodeEditor />
      </div>
    </div>

    <!-- Status Bar -->
    <div class="bg-gray-800 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-sm text-gray-400">
      <div class="flex items-center space-x-4">
        <span v-if="activeFile">
          Line {{ currentLine }}, Column {{ currentColumn }}
        </span>
        <span v-if="activeFile">
          {{ activeFile.fileType.toUpperCase() }}
        </span>
        <span v-if="activeFile && activeFile.isDirty" class="text-orange-400">
          Unsaved changes
        </span>
      </div>
      
      <div class="flex items-center space-x-4">
        <span>{{ openFilesCount }} files open</span>
        <span>Ready</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import FileExplorer from '@/components/FileExplorer.vue'
import TabSystem from '@/components/TabSystem.vue'
import CodeEditor from '@/components/CodeEditor.vue'
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const editorStore = useEditorStore()

// Computed properties
const activeFile = computed(() => editorStore.activeFile)
const openFilesCount = computed(() => editorStore.openFiles.length)

const hasUnsavedFiles = computed(() => {
  return editorStore.openFiles.some(file => file.isDirty)
})

// Status bar info (mock data for now)
const currentLine = ref(1)
const currentColumn = ref(1)

// Methods
async function createNewFile() {
  const fileName = prompt('Enter file name (with extension .html, .css, or .js):')
  if (!fileName) return

  const extension = fileName.split('.').pop()?.toLowerCase()
  if (!extension || !['html', 'css', 'js'].includes(extension)) {
    toast("Please use .html, .css, or .js extension", {
      "type": "info",
      "dangerouslyHTMLString": true
    })
    return
  }

  const fileType = extension as 'html' | 'css' | 'js'
  const newFileId = await editorStore.createNewFile(fileName, fileType)
  if (newFileId) {
    editorStore.openFile(newFileId)
  }
}

function saveAll() {
  editorStore.openFiles.forEach(file => {
    if (file.isDirty) {
      editorStore.saveFile(file.id)
    }
  })
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Ctrl+N for new file
  if (event.ctrlKey && event.key === 'n') {
    event.preventDefault()
    createNewFile()
  }
  
  // Ctrl+Shift+S for save all
  if (event.ctrlKey && event.shiftKey && event.key === 'S') {
    event.preventDefault()
    saveAll()
  }
})
</script>

<style scoped>
.code-editor-layout {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>