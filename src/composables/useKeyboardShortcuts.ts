import { onMounted, onUnmounted } from 'vue'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  function handleKeyDown(event: KeyboardEvent) {
    for (const shortcut of shortcuts) {
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const matchesCtrl = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey
      const matchesShift = shortcut.shiftKey ? event.shiftKey : !event.shiftKey
      const matchesAlt = shortcut.altKey ? event.altKey : !event.altKey

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
        event.preventDefault()
        shortcut.callback()
        break
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    handleKeyDown,
  }
}
