<template>
  <div class="code-editor-layout h-screen flex flex-col bg-gray-900">
    <!-- Top Menu Bar (Optional) -->
    <div class="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-white font-semibold text-lg">Code Editor</h1>
      </div>

      <div class="flex items-center space-x-2">
        <button @click="createNewFile"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          New File
        </button>
        <button @click="saveAll" :disabled="!hasUnsavedFiles"
          class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
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

    <!-- Input Modal -->
    <InputModal :show="showFileModal" title="Create New File" placeholder="e.g. index.html" confirm-text="Create"
      :validator="validateFileName" @confirm="handleCreateFileConfirm" @cancel="showFileModal = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useFileValidation } from '@/composables/useFileValidation'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import FileExplorer from '@/components/FileExplorer.vue'
import TabSystem from '@/components/TabSystem.vue'
import CodeEditor from '@/components/CodeEditor.vue'
import InputModal from '@/components/InputModal.vue'

const editorStore = useEditorStore()
const { validateFileName, getFileTypeFromName } = useFileValidation()

// Modal state
const showFileModal = ref(false)

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
function createNewFile() {
  showFileModal.value = true
}

function saveAll() {
  editorStore.openFiles.forEach(file => {
    if (file.isDirty) {
      editorStore.saveFile(file.id)
    }
  })
}

async function handleCreateFileConfirm(fileName: string) {
  const fileType = getFileTypeFromName(fileName)
  if (fileType) {
    const newFileId = await editorStore.createNewFile(fileName, fileType)
    if (newFileId) {
      editorStore.openFile(newFileId)
    }
  }
  showFileModal.value = false
}

// Keyboard shortcuts
useKeyboardShortcuts([
  {
    key: 'n',
    ctrlKey: true,
    callback: createNewFile,
    description: 'Create new file'
  },
  {
    key: 's',
    ctrlKey: true,
    shiftKey: true,
    callback: saveAll,
    description: 'Save all files'
  }
])
</script>

<style scoped>
.code-editor-layout {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>