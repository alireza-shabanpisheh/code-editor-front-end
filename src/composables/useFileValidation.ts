export function useFileValidation() {
  // Validate file name
  function validateFileName(fileName: string): string | null {
    if (!fileName.trim()) {
      return 'File name cannot be empty'
    }

    const extension = fileName.split('.').pop()?.toLowerCase()
    if (!extension || !['html', 'css', 'js'].includes(extension)) {
      return 'Please use .html, .css, or .js extension'
    }

    return null
  }

  // Validate folder name
  function validateFolderName(folderName: string): string | null {
    if (!folderName.trim()) {
      return 'Folder name cannot be empty'
    }

    if (folderName.includes('.')) {
      return 'Folder names should not contain dots'
    }

    return null
  }

  // Get file type from filename
  function getFileTypeFromName(fileName: string): 'html' | 'css' | 'js' | null {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension && ['html', 'css', 'js'].includes(extension)) {
      return extension as 'html' | 'css' | 'js'
    }
    return null
  }

  return {
    validateFileName,
    validateFolderName,
    getFileTypeFromName,
  }
}
