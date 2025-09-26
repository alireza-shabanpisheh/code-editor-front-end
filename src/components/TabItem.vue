<template>
  <div class="tab-item flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer min-w-0 max-w-xs group"
    :class="tabClasses" @click="$emit('click', file.id)">
    <div class="w-3 h-3 rounded-sm flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0"
      :class="getFileIconClassForFile()">
      {{ getFileIconTextForFile() }}
    </div>

    <span class="truncate text-sm" :class="{ 'text-white': isActive, 'text-gray-300': !isActive }" :title="file.name">
      {{ file.name }}
    </span>

    <div v-if="file.isDirty" class="w-2 h-2 bg-orange-500 rounded-full ml-1 flex-shrink-0" title="Unsaved changes">
    </div>

    <button
      class="ml-2 p-1 rounded hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      :class="{ 'opacity-100': isActive }" @click.stop="$emit('close', file.id)" title="Close">
      <svg class="w-3 h-3 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OpenFile } from '@/stores/editor'
import { useFileIcons } from '@/composables/useFileIcons'

interface Props {
  file: OpenFile
  isActive: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [fileId: string]
  close: [fileId: string]
}>()

const { getFileIconClass, getFileIconText } = useFileIcons()

const tabClasses = computed(() => {
  const baseClasses = 'transition-colors duration-150'

  if (props.isActive) {
    return `${baseClasses} bg-gray-800 border-t-2 border-t-blue-500`
  }

  return `${baseClasses} bg-gray-900 hover:bg-gray-800 border-t-2 border-t-transparent`
})

function getFileIconClassForFile() {
  return getFileIconClass(props.file.fileType)
}

function getFileIconTextForFile() {
  return getFileIconText(props.file.fileType)
}
</script>

<style scoped>
.tab-item {
  user-select: none;
}
</style>