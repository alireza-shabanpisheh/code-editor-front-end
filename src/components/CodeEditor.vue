<template>
  <div class="code-editor flex-1 flex flex-col h-full">
    <div v-if="!activeFile" class="flex-1 flex items-center justify-center bg-gray-900 text-gray-500">
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h6a1 1 0 100-2H5z"
            clip-rule="evenodd" />
        </svg>
        <p class="text-lg font-medium">No file selected</p>
        <p class="text-sm mt-2">Open a file from the explorer to start editing</p>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col bg-gray-900">
      <!-- Toolbar -->
      <div class="border-b border-gray-700 bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-gray-300 text-sm">{{ activeFile.name }}</span>
          <span v-if="activeFile.isDirty" class="text-orange-500 text-xs">
            • Modified
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <button @click="saveCurrentFile" :disabled="!activeFile.isDirty"
            class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            Save
          </button>

          <button @click="async () => await formatCode()"
            class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            Format
          </button>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="flex-1 relative">
        <textarea ref="editorTextarea" v-model="editorContent" @input="handleContentChange" @scroll="syncScroll"
          @keydown="handleKeyDown"
          class="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent font-mono text-sm leading-6 resize-none outline-none z-20 caret-white"
          style="tab-size: 2; white-space: pre; overflow-wrap: normal;" spellcheck="false"
          placeholder="Start typing..."></textarea>

        <!-- Syntax Highlighting Layer -->
        <div ref="highlightLayer"
          class="absolute inset-0 w-full h-full p-4 pointer-events-none overflow-hidden font-mono text-sm leading-6 whitespace-pre z-10 highlight-layer"
          v-html="highlightedCode"></div>

        <!-- Line Numbers -->
        <div ref="lineNumbers"
          class="absolute left-0 top-0 w-12 h-full bg-gray-850 border-r border-gray-700 py-4 text-gray-500 text-sm font-mono leading-6 text-right pr-2 z-30 select-none">
          <div v-for="line in lineCount" :key="line" class="leading-6">
            {{ line }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCodeEditor } from '@/composables/useCodeEditor'

const {
  editorTextarea,
  highlightLayer,
  lineNumbers,
  editorContent,
  activeFile,
  lineCount,
  highlightedCode,
  handleContentChange,
  syncScroll,
  handleKeyDown,
  saveCurrentFile,
  formatCode
} = useCodeEditor()
</script>

<style scoped>
.bg-gray-850 {
  background-color: #1a1e23;
}

/* Custom scrollbar */
.code-editor textarea::-webkit-scrollbar,
.code-editor .absolute::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-editor textarea::-webkit-scrollbar-track,
.code-editor .absolute::-webkit-scrollbar-track {
  background: #1F2937;
}

.code-editor textarea::-webkit-scrollbar-thumb,
.code-editor .absolute::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

.code-editor textarea::-webkit-scrollbar-thumb:hover,
.code-editor .absolute::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* Line numbers padding adjustments */
.code-editor textarea {
  padding-left: 3.5rem !important;
}

.code-editor .absolute.inset-0.p-4 {
  padding-left: 3.5rem !important;
}

/* Textarea improvements for syntax highlighting */
.code-editor textarea {
  color: transparent;
  background: transparent;
  caret-color: white;
  -webkit-text-fill-color: transparent;
}

.code-editor textarea::placeholder {
  color: #6B7280;
  -webkit-text-fill-color: #6B7280;
}

.code-editor textarea:focus {
  outline: none;
  border: none;
}

/* Highlight layer styling */
.code-editor .highlight-layer {
  color: #F3F4F6;
  background: transparent;
  overflow: hidden;
}
</style>