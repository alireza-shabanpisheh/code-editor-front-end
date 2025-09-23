<template>
  <div class="file-explorer bg-gray-800 text-white w-64 h-full overflow-y-auto border-r border-gray-700">
    <div class="p-3 border-b border-gray-700">
      <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">Explorer</h3>
    </div>
    
    <div class="p-2">
      <div class="mb-2 flex gap-2">
        <button 
          @click="createNewFile"
          class="flex-1 text-left text-xs text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors"
          title="New File"
        >
          📄 New File
        </button>
        <button 
          @click="createNewFolder"
          class="flex-1 text-left text-xs text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors"
          title="New Folder"
        >
          📁 New Folder
        </button>
      </div>
      
      <FileTreeNode 
        v-for="node in fileTree" 
        :key="node.id"
        :node="node"
        :level="0"
        @open-file="handleOpenFile"
        @toggle-folder="handleToggleFolder"
        @create-file="handleCreateFile"
        @create-folder="handleCreateFolder"
        @delete-item="handleDeleteItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import FileTreeNode from './FileTreeNode.vue'
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const editorStore = useEditorStore()

const fileTree = computed(() => editorStore.fileTree)

function handleOpenFile(fileId: string) {
  editorStore.openFile(fileId)
}

function handleToggleFolder(folderId: string) {
  editorStore.toggleFolder(folderId)
}

function handleCreateFile(parentId: string) {
  createFileInParent(parentId)
}

function handleCreateFolder(parentId: string) {
  createFolderInParent(parentId)
}

function handleDeleteItem(itemId: string) {
  if (confirm('Are you sure you want to delete this item?')) {
    editorStore.deleteItem(itemId)
  }
}

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

function createNewFolder() {
  const folderName = prompt('Enter folder name:')
  if (!folderName) return

  if (folderName.includes('.')) {
    toast("Folder names should not contain dots", {
  "type": "info",
  "dangerouslyHTMLString": true
})
    return
  }

  editorStore.createNewFolder(folderName)
}

async function createFileInParent(parentId: string) {
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
  const newFileId = await editorStore.createNewFile(fileName, fileType, parentId)
  if (newFileId) {
    editorStore.openFile(newFileId)
  }
}

function createFolderInParent(parentId: string) {
  const folderName = prompt('Enter folder name:')
  if (!folderName) return

  if (folderName.includes('.')) {
        toast("Folder names should not contain dots", {
        "type": "info",
        "dangerouslyHTMLString": true
        })
    return
  }

  editorStore.createNewFolder(folderName, parentId)
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