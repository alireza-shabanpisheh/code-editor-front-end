import { ref, computed, watch, nextTick, type Ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/themes/prism-okaidia.css'
import prettier from 'prettier/standalone'
import * as babelPlugin from 'prettier/plugins/babel'
import * as htmlPlugin from 'prettier/plugins/html'
import * as postcssPlugin from 'prettier/plugins/postcss'
import * as estreePlugin from 'prettier/plugins/estree'
import type { Plugin } from 'prettier'

export function useCodeEditor() {
  const editorStore = useEditorStore()

  // Refs for DOM elements
  const editorTextarea = ref<HTMLTextAreaElement>()
  const highlightLayer = ref<HTMLDivElement>()
  const lineNumbers = ref<HTMLDivElement>()

  // Editor content state
  const editorContent = ref('')

  // Computed properties
  const activeFile = computed(() => editorStore.activeFile)

  const lineCount = computed(() => {
    if (!editorContent.value) return 1
    return editorContent.value.split('\n').length
  })

  const highlightedCode = computed(() => {
    if (!activeFile.value || !editorContent.value) return ''

    const content = editorContent.value
    const fileType = activeFile.value.fileType

    return highlightSyntax(content, fileType)
  })

  // Syntax highlighting function
  function highlightSyntax(code: string, fileType: 'html' | 'css' | 'js'): string {
    if (!code) return ''

    switch (fileType) {
      case 'html':
        return Prism.highlight(code, Prism.languages.html, 'html')
      case 'css':
        return Prism.highlight(code, Prism.languages.css, 'css')
      case 'js':
        return Prism.highlight(code, Prism.languages.javascript, 'javascript')
      default:
        return code
    }
  }

  // Sync content with active file
  watch(
    activeFile,
    (newFile) => {
      if (newFile) {
        editorContent.value = newFile.content
      } else {
        editorContent.value = ''
      }
    },
    { immediate: true },
  )

  // Handle content changes
  function handleContentChange() {
    if (activeFile.value) {
      editorStore.updateFileContent(activeFile.value.id, editorContent.value)
    }

    nextTick(() => {
      syncScroll()
    })
  }

  // Sync scroll between editor layers
  function syncScroll() {
    if (editorTextarea.value && highlightLayer.value && lineNumbers.value) {
      const scrollTop = editorTextarea.value.scrollTop
      const scrollLeft = editorTextarea.value.scrollLeft

      highlightLayer.value.scrollTop = scrollTop
      highlightLayer.value.scrollLeft = scrollLeft
      lineNumbers.value.scrollTop = scrollTop
    }
  }

  // Handle keyboard events
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

      handleContentChange()
    }

    // Ctrl+S for save
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault()
      saveCurrentFile()
    }
  }

  // Save current file
  function saveCurrentFile() {
    if (activeFile.value && activeFile.value.isDirty) {
      editorStore.saveFile(activeFile.value.id)
    }
  }

  // Format code
  async function formatCode() {
    if (!activeFile.value) return

    const fileType = activeFile.value.fileType
    let formatted = editorContent.value

    try {
      switch (fileType) {
        case 'html':
          formatted = await prettier.format(editorContent.value, {
            parser: 'html',
            plugins: [htmlPlugin],
            tabWidth: 2,
            useTabs: false,
            printWidth: 80,
          })
          break

        case 'css':
          formatted = await prettier.format(editorContent.value, {
            parser: 'css',
            plugins: [postcssPlugin],
            tabWidth: 2,
            useTabs: false,
            printWidth: 80,
          })
          break

        case 'js':
          formatted = await prettier.format(editorContent.value, {
            parser: 'babel',
            plugins: [babelPlugin, estreePlugin] as Plugin<any>[],
            tabWidth: 2,
            useTabs: false,
            printWidth: 80,
          })
          break
      }

      editorContent.value = formatted
      handleContentChange()
    } catch (error) {
      console.error('Error formatting code:', error)
    }
  }

  return {
    // Refs
    editorTextarea,
    highlightLayer,
    lineNumbers,

    // State
    editorContent,

    // Computed
    activeFile,
    lineCount,
    highlightedCode,

    // Methods
    handleContentChange,
    syncScroll,
    handleKeyDown,
    saveCurrentFile,
    formatCode,
  }
}
