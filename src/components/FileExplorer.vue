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
import { useFileValidation } from '@/composables/useFileValidation'
import FileTreeNode from './FileTreeNode.vue'
import InputModal from './InputModal.vue'

const editorStore = useEditorStore()
const { validateFileName, validateFolderName, getFileTypeFromName } = useFileValidation()

// Modal states
const showFileModal = ref(false)
const showFolderModal = ref(false)
const showFileInParentModal = ref(false)
const showFolderInParentModal = ref(false)
const currentParentId = ref<string | undefined>(undefined)

const fileTree = computed(() => editorStore.fileTree)

// Event handlers
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
  editorStore.deleteItem(itemId)
}

// Modal actions
function createNewFile() {
  showFileModal.value = true
}

function createNewFolder() {
  showFolderModal.value = true
}

// Confirm handlers
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

async function handleCreateFolderConfirm(folderName: string) {
  await editorStore.createNewFolder(folderName)
  showFolderModal.value = false
}

async function handleCreateFileInParentConfirm(fileName: string) {
  const fileType = getFileTypeFromName(fileName)
  if (fileType) {
    const newFileId = await editorStore.createNewFile(fileName, fileType, currentParentId.value)
    if (newFileId) {
      editorStore.openFile(newFileId)
    }
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