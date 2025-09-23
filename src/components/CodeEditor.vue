<template>
  <div class="code-editor flex-1 flex flex-col h-full">
    <div 
      v-if="!activeFile"
      class="flex-1 flex items-center justify-center bg-gray-900 text-gray-500"
    >
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h6a1 1 0 100-2H5z" clip-rule="evenodd" />
        </svg>
        <p class="text-lg font-medium">No file selected</p>
        <p class="text-sm mt-2">Open a file from the explorer to start editing</p>
      </div>
    </div>
    
    <div 
      v-else
      class="flex-1 flex flex-col bg-gray-900"
    >
      <!-- Toolbar -->
      <div class="border-b border-gray-700 bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-gray-300 text-sm">{{ activeFile.name }}</span>
          <span 
            v-if="activeFile.isDirty"
            class="text-orange-500 text-xs"
          >
            • Modified
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="saveCurrentFile"
            :disabled="!activeFile.isDirty"
            class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
          
          <button
            @click="async () => await formatCode()"
            class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Format
          </button>
        </div>
      </div>
      
      <!-- Editor Area -->
      <div class="flex-1 relative">
        <textarea
          ref="editorTextarea"
          v-model="editorContent"
          @input="handleContentChange"
          @scroll="syncScroll"
          @keydown="handleKeyDown"
          class="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent font-mono text-sm leading-6 resize-none outline-none z-20 caret-white"
          style="tab-size: 2; white-space: pre; overflow-wrap: normal;"
          spellcheck="false"
          placeholder="Start typing..."
        ></textarea>
        
        <!-- Syntax Highlighting Layer -->
        <div 
          ref="highlightLayer"
          class="absolute inset-0 w-full h-full p-4 pointer-events-none overflow-hidden font-mono text-sm leading-6 whitespace-pre z-10 highlight-layer"
          v-html="highlightedCode"
        ></div>
        
        <!-- Line Numbers -->
        <div 
          ref="lineNumbers"
          class="absolute left-0 top-0 w-12 h-full bg-gray-850 border-r border-gray-700 py-4 text-gray-500 text-sm font-mono leading-6 text-right pr-2 z-30 select-none"
        >
          <div v-for="line in lineCount" :key="line" class="leading-6">
            {{ line }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useEditorStore } from '@/stores/editor'
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript'; // برای پشتیبانی از JavaScript
import 'prismjs/components/prism-markup'; // برای HTML
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-okaidia.css';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel'; // برای JavaScript
import parserHtml from 'prettier/parser-html'; // برای HTML
import parserCss from 'prettier/parser-postcss'; // برای CSS

const editorStore = useEditorStore()

const editorTextarea = ref<HTMLTextAreaElement>()
const highlightLayer = ref<HTMLDivElement>()
const lineNumbers = ref<HTMLDivElement>()

const activeFile = computed(() => editorStore.activeFile)

const editorContent = ref('')

// محاسبه تعداد خطوط
const lineCount = computed(() => {
  if (!editorContent.value) return 1
  return editorContent.value.split('\n').length
})

// هماهنگ‌سازی محتوا با فایل فعال
watch(activeFile, (newFile) => {
  if (newFile) {
    editorContent.value = newFile.content
  } else {
    editorContent.value = ''
  }
}, { immediate: true })

// Syntax highlighting
const highlightedCode = computed(() => {
  if (!activeFile.value || !editorContent.value) return ''
  
  const content = editorContent.value
  const fileType = activeFile.value.fileType
  
  return highlightSyntax(content, fileType)
})

function highlightSyntax(code: string, fileType: 'html' | 'css' | 'js'): string {
  if (!code) return ''
  
  switch (fileType) {
    case 'html':
      return Prism.highlight(code, Prism.languages.html, 'html');
    case 'css':
      // For CSS, no escaping needed as it doesn't contain HTML tags
      return Prism.highlight(code, Prism.languages.css, 'css');
    case 'js':
      // For JS, no escaping needed as it doesn't contain HTML tags
      return Prism.highlight(code, Prism.languages.javascript, 'javascript');
  }
  
}


function handleContentChange() {
  if (activeFile.value) {
    editorStore.updateFileContent(activeFile.value.id, editorContent.value)
  }
  
  // هماهنگ‌سازی اسکرول
  nextTick(() => {
    syncScroll()
  })
}

function syncScroll() {
  if (editorTextarea.value && highlightLayer.value && lineNumbers.value) {
    const scrollTop = editorTextarea.value.scrollTop
    const scrollLeft = editorTextarea.value.scrollLeft
    
    highlightLayer.value.scrollTop = scrollTop
    highlightLayer.value.scrollLeft = scrollLeft
    lineNumbers.value.scrollTop = scrollTop
  }
}

function handleKeyDown(event: KeyboardEvent) {
  // Tab handling
  if (event.key === 'Tab') {
    event.preventDefault()
    const textarea = editorTextarea.value
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    // Insert 2 spaces for tab
    const tabChar = '  '
    const value = textarea.value
    textarea.value = value.substring(0, start) + tabChar + value.substring(end)
    textarea.selectionStart = textarea.selectionEnd = start + tabChar.length
    
    // Trigger input event manually
    handleContentChange()
  }
  
  // Ctrl+S for save
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    saveCurrentFile()
  }
}

function saveCurrentFile() {
  if (activeFile.value && activeFile.value.isDirty) {
    editorStore.saveFile(activeFile.value.id)
  }
}

async function formatCode() {
  if (!activeFile.value) return;

  const fileType = activeFile.value.fileType;
  let formatted = editorContent.value;

  try {
    switch (fileType) {
      case 'html':
        formatted = await prettier.format(editorContent.value, {
          parser: 'html',
          plugins: [parserHtml],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
        });
        
        break;
      case 'css':
        formatted = await prettier.format(editorContent.value, {
          parser: 'css',
          plugins: [parserCss],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
        });
        break;
      case 'js':
        formatted = await prettier.format(editorContent.value, {
          parser: 'babel',
          plugins: [parserBabel],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
        });
        break;
    }
  } catch (error) {
    console.error('Error formatting code:', error);
    // اگه خطایی رخ داد، کد بدون تغییر می‌مونه
  }

  editorContent.value = formatted;
  handleContentChange();
}

// function formatHTML(code: string): string {
//   // Very basic HTML formatting
//   return code
//     .replace(/>\s*</g, '>\n<')
//     .split('\n')
//     .map(line => line.trim())
//     .filter(line => line.length > 0)
//     .join('\n')
// }

// function formatCSS(code: string): string {
//   // Very basic CSS formatting
//   return code
//     .replace(/\{/g, ' {\n  ')
//     .replace(/\}/g, '\n}\n')
//     .replace(/;/g, ';\n  ')
//     .replace(/,/g, ',\n')
//     .split('\n')
//     .map(line => line.trim())
//     .filter(line => line.length > 0)
//     .join('\n')
// }

// function formatJS(code: string): string {
//   // Very basic JS formatting
//   return code
//     .replace(/\{/g, ' {\n  ')
//     .replace(/\}/g, '\n}\n')
//     .replace(/;/g, ';\n')
//     .split('\n')
//     .map(line => line.trim())
//     .filter(line => line.length > 0)
//     .join('\n')
// }

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