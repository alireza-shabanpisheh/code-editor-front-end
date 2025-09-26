export function useFileIcons() {
  // Get icon class based on file type
  function getFileIconClass(fileType?: 'html' | 'css' | 'js'): string {
    if (!fileType) return 'bg-gray-500 text-white'

    switch (fileType) {
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

  // Get icon text based on file type
  function getFileIconText(fileType?: 'html' | 'css' | 'js'): string {
    if (!fileType) return 'F'

    switch (fileType) {
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

  return {
    getFileIconClass,
    getFileIconText,
  }
}
