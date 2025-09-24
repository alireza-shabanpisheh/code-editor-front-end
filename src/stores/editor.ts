import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiService } from '@/services/api'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  isOpen?: boolean
  fileType?: 'html' | 'css' | 'js'
}

export interface OpenFile {
  id: string
  name: string
  content: string
  fileType: 'html' | 'css' | 'js'
  isDirty: boolean
}

export const useEditorStore = defineStore('editor', () => {
  // ساختار پوشه‌ای پروژه
  const fileTree = ref<FileNode[]>([])

  // Loading state
  const isLoading = ref(false)

  // Error state
  const error = ref<string | null>(null)

  // فایل‌های باز شده
  const openFiles = ref<OpenFile[]>([])

  // فایل فعال
  const activeFileId = ref<string | null>(null)

  // کلیدهای localStorage
  const STORAGE_KEYS = {
    OPEN_FILES: 'editor-open-files',
    ACTIVE_FILE_ID: 'editor-active-file-id',
  }

  // محاسبه شده: فایل فعال
  const activeFile = computed(() => {
    if (!activeFileId.value) return null
    return openFiles.value.find((file) => file.id === activeFileId.value) || null
  })

  // بارگذاری اولیه داده‌ها از سرور
  async function loadFileTree() {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.getFileTree()
      if (response.success && response.data) {
        fileTree.value = response.data

        // بررسی تب‌های باز و حذف فایل‌هایی که دیگر در درخت وجود ندارند
        const filesToRemove: string[] = []
        for (const openFile of openFiles.value) {
          const fileExists = findFileInTree(openFile.id)
          if (!fileExists) {
            filesToRemove.push(openFile.id)
          }
        }

        // حذف فایل‌های غیرموجود از تب‌ها
        for (const fileId of filesToRemove) {
          closeFile(fileId)
        }
      } else {
        error.value = response.message || 'خطا در بارگذاری فایل‌ها'
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to load file tree:', err)
    } finally {
      isLoading.value = false
    }
  }

  // پیدا کردن فایل در درخت
  function findFileInTree(fileId: string, nodes: FileNode[] = fileTree.value): FileNode | null {
    for (const node of nodes) {
      if (node.id === fileId) {
        return node
      }
      if (node.children) {
        const found = findFileInTree(fileId, node.children)
        if (found) return found
      }
    }
    return null
  }

  // باز کردن فایل
  async function openFile(fileId: string) {
    const fileNode = findFileInTree(fileId)
    if (!fileNode || fileNode.type !== 'file' || !fileNode.fileType) return

    // بررسی اینکه فایل قبلاً باز شده یا نه
    const existingFile = openFiles.value.find((file) => file.id === fileId)
    if (existingFile) {
      activeFileId.value = fileId
      // ذخیره وضعیت تب‌ها
      saveTabsState()
      return
    }

    try {
      // دریافت محتوای فایل از سرور
      const response = await apiService.getFileContent(fileId)
      if (response.success && response.data) {
        const newFile: OpenFile = {
          id: fileId,
          name: fileNode.name,
          content: response.data.content,
          fileType: fileNode.fileType,
          isDirty: false,
        }

        openFiles.value.push(newFile)
        activeFileId.value = fileId
        // ذخیره وضعیت تب‌ها
        saveTabsState()
      } else {
        error.value = response.message || 'خطا در بارگذاری فایل'
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to open file:', err)
    }
  }

  // بستن فایل
  function closeFile(fileId: string) {
    const index = openFiles.value.findIndex((file) => file.id === fileId)
    if (index === -1) return

    openFiles.value.splice(index, 1)

    // اگر فایل بسته شده فایل فعال بود، فایل دیگری را فعال کن
    if (activeFileId.value === fileId) {
      if (openFiles.value.length > 0) {
        activeFileId.value = openFiles.value[openFiles.value.length - 1].id
      } else {
        activeFileId.value = null
      }
    }

    // ذخیره وضعیت تب‌ها
    saveTabsState()
  }

  // تغییر محتوای فایل
  function updateFileContent(fileId: string, content: string) {
    const file = openFiles.value.find((f) => f.id === fileId)
    if (file) {
      file.content = content
      file.isDirty = true
    }
  }

  // ذخیره فایل
  async function saveFile(fileId: string) {
    const file = openFiles.value.find((f) => f.id === fileId)
    if (!file || !file.isDirty) return

    try {
      const response = await apiService.updateFileContent(fileId, file.content)
      if (response.success) {
        file.isDirty = false
        // بروزرسانی محتوا در درخت فایل‌ها نیز
        const fileNode = findFileInTree(fileId)
        if (fileNode) {
          fileNode.content = file.content
        }
      } else {
        error.value = response.message || 'خطا در ذخیره فایل'
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to save file:', err)
    }
  }

  // تغییر وضعیت باز/بسته پوشه
  async function toggleFolder(folderId: string) {
    try {
      const response = await apiService.toggleFolder(folderId)
      if (response.success) {
        // بروزرسانی محلی
        const folder = findFileInTree(folderId)
        if (folder && folder.type === 'folder') {
          folder.isOpen = !folder.isOpen
        }
      } else {
        error.value = response.message || 'خطا در تغییر وضعیت فولدر'
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to toggle folder:', err)
    }
  }

  // ایجاد فایل جدید
  async function createNewFile(name: string, fileType: 'html' | 'css' | 'js', parentId?: string) {
    try {
      const response = await apiService.createFile(name, fileType, parentId)
      if (response.success && response.data) {
        // بروزرسانی درخت فایل‌ها
        await loadFileTree()
        return response.data.id
      } else {
        error.value = response.message || 'خطا در ایجاد فایل'
        return null
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to create file:', err)
      return null
    }
  }

  // ایجاد فولدر جدید
  async function createNewFolder(name: string, parentId?: string) {
    try {
      const response = await apiService.createFolder(name, parentId)
      if (response.success && response.data) {
        // بروزرسانی درخت فایل‌ها
        await loadFileTree()
        return response.data.id
      } else {
        error.value = response.message || 'خطا در ایجاد فولدر'
        return null
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to create folder:', err)
      return null
    }
  }

  // حذف فایل یا فولدر
  async function deleteItem(itemId: string) {
    try {
      // ابتدا آیتم را در درخت پیدا می‌کنیم تا نوع آن را بدانیم
      const itemToDelete = findFileInTree(itemId)

      const response = await apiService.deleteItem(itemId)
      if (response.success) {
        if (itemToDelete) {
          if (itemToDelete.type === 'file') {
            // اگر فایل است، فقط آن را بستن
            closeFile(itemId)
          } else if (itemToDelete.type === 'folder') {
            // اگر پوشه است، تمام فایل‌های زیرمجموعه را بستن
            closeFilesInFolder(itemToDelete)
          }
        }

        // بروزرسانی درخت فایل‌ها
        await loadFileTree()
      } else {
        error.value = response.message || 'خطا در حذف آیتم'
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to delete item:', err)
    }
  }

  // بستن تمام فایل‌های داخل یک پوشه (به صورت بازگشتی)
  function closeFilesInFolder(folderNode: FileNode) {
    if (!folderNode.children) return

    for (const child of folderNode.children) {
      if (child.type === 'file') {
        // بستن فایل
        closeFile(child.id)
      } else if (child.type === 'folder') {
        // بررسی بازگشتی پوشه‌های زیرمجموعه
        closeFilesInFolder(child)
      }
    }
  }

  // محتوای پیش‌فرض برای انواع فایل
  function getDefaultContent(fileType: 'html' | 'css' | 'js'): string {
    switch (fileType) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`
      case 'css':
        return `/* Your CSS styles here */

`
      case 'js':
        return `// Your JavaScript code here

`
      default:
        return ''
    }
  }

  // ریست پروژه
  async function resetProject() {
    try {
      const response = await apiService.resetProject()
      if (response.success) {
        // بستن همه فایل‌های باز
        openFiles.value = []
        activeFileId.value = null
        // پاک کردن وضعیت ذخیره شده
        clearTabsState()
        // بروزرسانی درخت فایل‌ها
        await loadFileTree()
      } else {
        error.value = response.message || 'خطا در ریست پروژه'
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور'
      console.error('Failed to reset project:', err)
    }
  }

  // پاک کردن خطا
  function clearError() {
    error.value = null
  }

  // ذخیره وضعیت تب‌ها در localStorage
  function saveTabsState() {
    try {
      localStorage.setItem(STORAGE_KEYS.OPEN_FILES, JSON.stringify(openFiles.value))
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FILE_ID, activeFileId.value || '')
    } catch (error) {
      console.warn('Failed to save tabs state to localStorage:', error)
    }
  }

  // بازیابی وضعیت تب‌ها از localStorage
  async function restoreTabsState() {
    try {
      const savedOpenFiles = localStorage.getItem(STORAGE_KEYS.OPEN_FILES)
      const savedActiveFileId = localStorage.getItem(STORAGE_KEYS.ACTIVE_FILE_ID)

      if (savedOpenFiles) {
        const parsedOpenFiles = JSON.parse(savedOpenFiles)
        // بررسی اینکه آرایه معتبری دریافت کرده‌ایم
        if (Array.isArray(parsedOpenFiles)) {
          // ابتدا فایل‌ها را با محتوای localStorage بارگذاری می‌کنیم
          openFiles.value = parsedOpenFiles

          // سپس محتوای فایل فعال را از سرور بازیابی می‌کنیم
          if (savedActiveFileId) {
            activeFileId.value = savedActiveFileId
            const activeFile = parsedOpenFiles.find((file) => file.id === savedActiveFileId)
            if (activeFile) {
              try {
                const response = await apiService.getFileContent(activeFile.id)
                if (response.success && response.data) {
                  // بروزرسانی محتوای فایل فعال
                  const fileIndex = openFiles.value.findIndex((f) => f.id === activeFile.id)
                  if (fileIndex !== -1) {
                    openFiles.value[fileIndex].content = response.data.content
                    openFiles.value[fileIndex].isDirty = false
                  }
                }
              } catch (err) {
                console.warn(`Failed to restore active file content for ${activeFile.name}:`, err)
              }
            }
          }

          // بقیه فایل‌ها را در پس‌زمینه بازیابی می‌کنیم
          setTimeout(async () => {
            for (const file of parsedOpenFiles) {
              if (file.id !== savedActiveFileId) {
                try {
                  const response = await apiService.getFileContent(file.id)
                  if (response.success && response.data) {
                    const fileIndex = openFiles.value.findIndex((f) => f.id === file.id)
                    if (fileIndex !== -1) {
                      openFiles.value[fileIndex].content = response.data.content
                      openFiles.value[fileIndex].isDirty = false
                    }
                  }
                } catch (err) {
                  console.warn(`Failed to restore content for file ${file.name}:`, err)
                }
              }
            }
          }, 100)
        }
      } else if (savedActiveFileId) {
        activeFileId.value = savedActiveFileId
      }
    } catch (error) {
      console.warn('Failed to restore tabs state from localStorage:', error)
      // در صورت خطا، وضعیت را ریست می‌کنیم
      openFiles.value = []
      activeFileId.value = null
    }
  }

  // پاک کردن وضعیت ذخیره شده
  function clearTabsState() {
    try {
      localStorage.removeItem(STORAGE_KEYS.OPEN_FILES)
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FILE_ID)
    } catch (error) {
      console.warn('Failed to clear tabs state from localStorage:', error)
    }
  }

  // بازیابی محتوای یک فایل خاص از سرور
  async function refreshFileContent(fileId: string) {
    const fileIndex = openFiles.value.findIndex((f) => f.id === fileId)
    if (fileIndex === -1) return false

    try {
      const response = await apiService.getFileContent(fileId)
      if (response.success && response.data) {
        openFiles.value[fileIndex].content = response.data.content
        openFiles.value[fileIndex].isDirty = false
        saveTabsState()
        return true
      }
    } catch (err) {
      console.warn(`Failed to refresh content for file ${fileId}:`, err)
    }
    return false
  }

  return {
    fileTree,
    openFiles,
    activeFileId,
    activeFile,
    isLoading,
    error,
    loadFileTree,
    openFile,
    closeFile,
    updateFileContent,
    saveFile,
    toggleFolder,
    createNewFile,
    createNewFolder,
    deleteItem,
    resetProject,
    clearError,
    findFileInTree,
    saveTabsState,
    restoreTabsState,
    clearTabsState,
    refreshFileContent,
    closeFilesInFolder,
  }
})
