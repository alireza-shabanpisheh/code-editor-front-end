<template>
  <div class="file-tree-node">
    <div 
      class="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer rounded text-sm group"
      :class="{ 'bg-gray-700': isSelected }"
      :style="{ paddingLeft: `${(level * 16) + 8}px` }"
      @click="handleClick"
      @contextmenu="handleRightClick"
    >
      <div class="w-4 h-4 mr-2 flex items-center justify-center">
        <template v-if="node.type === 'folder'">
          <svg v-if="node.isOpen" class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </template>
        <template v-else>
          <div 
            class="w-3 h-3 rounded-sm flex items-center justify-center text-xs font-bold"
            :class="getFileIconClass()"
          >
            {{ getFileIconText() }}
          </div>
        </template>
      </div>
      
      <span 
        class="truncate flex-1"
        :class="getFileNameClass()"
      >
        {{ node.name }}
      </span>

      <!-- Action buttons (show on hover) -->
      <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-2">
        <template v-if="node.type === 'folder'">
          <button
            @click.stop="$emit('create-file', node.id)"
            class="p-1 hover:bg-gray-600 rounded text-xs"
            title="New File"
          >
            📄
          </button>
          <button
            @click.stop="$emit('create-folder', node.id)"
            class="p-1 hover:bg-gray-600 rounded text-xs"
            title="New Folder"
          >
            📁
          </button>
        </template>
        <button
          @click.stop="$emit('delete-item', node.id)"
          class="p-1 hover:bg-gray-600 rounded text-xs text-red-400"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
    
    <template v-if="node.type === 'folder' && node.isOpen && node.children">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        @open-file="$emit('open-file', $event)"
        @toggle-folder="$emit('toggle-folder', $event)"
        @create-file="$emit('create-file', $event)"
        @create-folder="$emit('create-folder', $event)"
        @delete-item="$emit('delete-item', $event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FileNode } from '@/stores/editor'
import { useEditorStore } from '@/stores/editor'

interface Props {
  node: FileNode
  level: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'open-file': [fileId: string]
  'toggle-folder': [folderId: string]
  'create-file': [parentId: string]
  'create-folder': [parentId: string]
  'delete-item': [itemId: string]
}>()

const editorStore = useEditorStore()

const isSelected = computed(() => {
  return props.node.type === 'file' && editorStore.activeFileId === props.node.id
})

function handleClick() {
  if (props.node.type === 'folder') {
    emit('toggle-folder', props.node.id)
  } else {
    emit('open-file', props.node.id)
  }
}

function handleRightClick(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  
}

function getFileIconClass() {
  if (props.node.type !== 'file' || !props.node.fileType) return ''
  
  switch (props.node.fileType) {
    case 'html':
      return 'bg-orange-500 text-white'
    case 'css':
      return 'bg-blue-500 text-white'
    case 'js':
      return 'bg-yellow-500 text-black'
    default:
      return 'bg-gray-500 text-white'
  }
}

function getFileIconText() {
  if (props.node.type !== 'file' || !props.node.fileType) return ''
  
  switch (props.node.fileType) {
    case 'html':
      return 'H'
    case 'css':
      return 'C'
    case 'js':
      return 'J'
    default:
      return 'F'
  }
}

function getFileNameClass() {
  const baseClass = 'select-none'
  
  if (props.node.type === 'folder') {
    return `${baseClass} text-gray-200 font-medium`
  }
  
  if (isSelected.value) {
    return `${baseClass} text-white font-medium`
  }
  
  return `${baseClass} text-gray-300`
}
</script>

<style scoped>
.file-tree-node {
  user-select: none;
}
</style>