import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
  const fileTree = ref<FileNode[]>([
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'index.html',
          name: 'index.html',
          type: 'file',
          fileType: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to my code editor</p>
    <script src="script.js"></script>
</body>
</html>`
        },
        {
          id: 'styles.css',
          name: 'styles.css',
          type: 'file',
          fileType: 'css',
          content: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    text-align: center;
    font-size: 16px;
}`
        },
        {
          id: 'script.js',
          name: 'script.js',
          type: 'file',
          fileType: 'js',
          content: `console.log('Hello from script.js');

function greetUser() {
    const name = prompt('What is your name?');
    if (name) {
        alert('Hello, ' + name + '!');
    }
}

// Call the function when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready');
    
    // Add click event to h1
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', greetUser);
    }
});`
        }
      ]
    },
    {
      id: 'components',
      name: 'components',
      type: 'folder',
      isOpen: false,
      children: [
        {
          id: 'header.html',
          name: 'header.html',
          type: 'file',
          fileType: 'html',
          content: `<header class="main-header">
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
</header>`
        },
        {
          id: 'footer.js',
          name: 'footer.js',
          type: 'file',
          fileType: 'js',
          content: `function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = '<p>&copy; 2024 My Website. All rights reserved.</p>';
    footer.className = 'main-footer';
    return footer;
}

// Export for use in other files
window.createFooter = createFooter;`
        }
      ]
    }
  ])

  // فایل‌های باز شده
  const openFiles = ref<OpenFile[]>([])
  
  // فایل فعال
  const activeFileId = ref<string | null>(null)

  // محاسبه شده: فایل فعال
  const activeFile = computed(() => {
    if (!activeFileId.value) return null
    return openFiles.value.find(file => file.id === activeFileId.value) || null
  })

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
  function openFile(fileId: string) {
    const fileNode = findFileInTree(fileId)
    if (!fileNode || fileNode.type !== 'file' || !fileNode.fileType) return

    // بررسی اینکه فایل قبلاً باز شده یا نه
    const existingFile = openFiles.value.find(file => file.id === fileId)
    if (existingFile) {
      activeFileId.value = fileId
      return
    }

    // اضافه کردن فایل جدید به لیست فایل‌های باز
    const newFile: OpenFile = {
      id: fileId,
      name: fileNode.name,
      content: fileNode.content || '',
      fileType: fileNode.fileType,
      isDirty: false
    }

    openFiles.value.push(newFile)
    activeFileId.value = fileId
  }

  // بستن فایل
  function closeFile(fileId: string) {
    const index = openFiles.value.findIndex(file => file.id === fileId)
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
  }

  // تغییر محتوای فایل
  function updateFileContent(fileId: string, content: string) {
    const file = openFiles.value.find(f => f.id === fileId)
    if (file) {
      file.content = content
      file.isDirty = true
    }
  }

  // ذخیره فایل
  function saveFile(fileId: string) {
    const file = openFiles.value.find(f => f.id === fileId)
    if (file) {
      file.isDirty = false
      // اینجا می‌توان محتوا را در درخت فایل‌ها نیز بروزرسانی کرد
      const fileNode = findFileInTree(fileId)
      if (fileNode) {
        fileNode.content = file.content
      }
    }
  }

  // تغییر وضعیت باز/بسته پوشه
  function toggleFolder(folderId: string) {
    const folder = findFileInTree(folderId)
    if (folder && folder.type === 'folder') {
      folder.isOpen = !folder.isOpen
    }
  }

  // ایجاد فایل جدید
  function createNewFile(name: string, fileType: 'html' | 'css' | 'js', parentId?: string) {
    const newFile: FileNode = {
      id: `${Date.now()}-${name}`,
      name,
      type: 'file',
      fileType,
      content: getDefaultContent(fileType)
    }

    if (parentId) {
      const parent = findFileInTree(parentId)
      if (parent && parent.type === 'folder') {
        if (!parent.children) parent.children = []
        parent.children.push(newFile)
        parent.isOpen = true
      }
    } else {
      fileTree.value.push(newFile)
    }

    return newFile.id
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

  return {
    fileTree,
    openFiles,
    activeFileId,
    activeFile,
    openFile,
    closeFile,
    updateFileContent,
    saveFile,
    toggleFolder,
    createNewFile,
    findFileInTree
  }
})