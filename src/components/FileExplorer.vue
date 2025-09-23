<template>
  <div class="file-explorer bg-gray-800 text-white w-64 h-full overflow-y-auto border-r border-gray-700">
    <div class="p-3 border-b border-gray-700">
      <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">Explorer</h3>
    </div>

    <div class="p-2">
      <div class="mb-2 flex gap-2">
        <button @click="createNewFile"
          class="flex-1 text-left text-xs text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors"
          title="New File">
          📄 New File
        </button>
        <button @click="createNewFolder"
          class="flex-1 text-left text-xs text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors"
          title="New Folder">
          📁 New Folder
        </button>
      </div>

      <FileTreeNode v-for="node in fileTree" :key="node.id" :node="node" :level="0" @open-file="handleOpenFile"
        @toggle-folder="handleToggleFolder" @create-file="handleCreateFile" @create-folder="handleCreateFolder"
        @delete-item="handleDeleteItem" />
    </div>

    <!-- Input Modals -->
    <InputModal :show="showFileModal" title="Create New File" placeholder="e.g. index.html" confirm-text="Create"
      :validator="validateFileName" @confirm="handleCreateFileConfirm" @cancel="showFileModal = false" />

    <InputModal :show="showFolderModal" title="Create New Folder" placeholder="e.g. components" confirm-text="Create"
      :validator="validateFolderName" @confirm="handleCreateFolderConfirm" @cancel="showFolderModal = false" />

    <InputModal :show="showFileInParentModal" title="Create New File" placeholder="e.g. component.js"
      confirm-text="Create" :validator="validateFileName" @confirm="handleCreateFileInParentConfirm"
      @cancel="showFileInParentModal = false" />

    <InputModal :show="showFolderInParentModal" title="Create New Folder" placeholder="e.g. utils" confirm-text="Create"
      :validator="validateFolderName" @confirm="handleCreateFolderInParentConfirm"
      @cancel="showFolderInParentModal = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import FileTreeNode from './FileTreeNode.vue'
import InputModal from './InputModal.vue'
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const editorStore = useEditorStore()

// Modal states
const showFileModal = ref(false)
const showFolderModal = ref(false)
const showFileInParentModal = ref(false)
const showFolderInParentModal = ref(false)
const currentParentId = ref<string | undefined>(undefined)

const fileTree = computed(() => editorStore.fileTree)

function handleOpenFile(fileId: string) {
  editorStore.openFile(fileId)
}

function handleToggleFolder(folderId: string) {
  editorStore.toggleFolder(folderId)
}

function handleCreateFile(parentId: string) {
  currentParentId.value = parentId
  showFileInParentModal.value = true
}

function handleCreateFolder(parentId: string) {
  currentParentId.value = parentId
  showFolderInParentModal.value = true
}

function handleDeleteItem(itemId: string) {
  if (confirm('Are you sure you want to delete this item?')) {
    editorStore.deleteItem(itemId)
  }
}

// Modal handlers
function createNewFile() {
  showFileModal.value = true
}

function createNewFolder() {
  showFolderModal.value = true
}

// Validation functions
function validateFileName(fileName: string): string | null {
  if (!fileName.trim()) {
    return 'File name cannot be empty'
  }

  const extension = fileName.split('.').pop()?.toLowerCase()
  if (!extension || !['html', 'css', 'js'].includes(extension)) {
    return 'Please use .html, .css, or .js extension'
  }

  return null
}

function validateFolderName(folderName: string): string | null {
  if (!folderName.trim()) {
    return 'Folder name cannot be empty'
  }

  if (folderName.includes('.')) {
    return 'Folder names should not contain dots'
  }

  return null
}

// Confirm handlers
async function handleCreateFileConfirm(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() as 'html' | 'css' | 'js'
  const newFileId = await editorStore.createNewFile(fileName, extension)
  if (newFileId) {
    editorStore.openFile(newFileId)
  }
  showFileModal.value = false
}

async function handleCreateFolderConfirm(folderName: string) {
  await editorStore.createNewFolder(folderName)
  showFolderModal.value = false
}

async function handleCreateFileInParentConfirm(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() as 'html' | 'css' | 'js'
  const newFileId = await editorStore.createNewFile(fileName, extension, currentParentId.value)
  if (newFileId) {
    editorStore.openFile(newFileId)
  }
  showFileInParentModal.value = false
  currentParentId.value = undefined
}

async function handleCreateFolderInParentConfirm(folderName: string) {
  await editorStore.createNewFolder(folderName, currentParentId.value)
  showFolderInParentModal.value = false
  currentParentId.value = undefined
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