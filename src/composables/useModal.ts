import { ref, computed, nextTick, watch } from 'vue'

export type ValidatorFunction = (value: string) => string | null

export interface ModalConfig {
  title: string
  placeholder?: string
  confirmText?: string
  inputType?: string
  validator?: ValidatorFunction
}

export function useModal() {
  const showModal = ref(false)
  const inputValue = ref('')
  const errorMessage = ref('')
  const inputRef = ref<HTMLInputElement>()

  // Check if confirm button should be enabled
  const canConfirm = computed(() => {
    return inputValue.value.trim().length > 0 && !errorMessage.value
  })

  // Open modal with optional config
  function openModal() {
    showModal.value = true
  }

  // Close modal and reset state
  function closeModal() {
    showModal.value = false
    resetModal()
  }

  // Reset modal state
  function resetModal() {
    inputValue.value = ''
    errorMessage.value = ''
  }

  // Focus input when modal opens
  watch(showModal, (newShow) => {
    if (newShow) {
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  })

  // Clear error when input changes
  watch(inputValue, () => {
    if (errorMessage.value) {
      errorMessage.value = ''
    }
  })

  // Validate input with provided validator
  function validateInput(validator?: ValidatorFunction): boolean {
    if (!validator) return true

    const value = inputValue.value.trim()
    const error = validator(value)
    if (error) {
      errorMessage.value = error
      return false
    }

    return true
  }

  return {
    // State
    showModal,
    inputValue,
    errorMessage,
    inputRef,

    // Computed
    canConfirm,

    // Methods
    openModal,
    closeModal,
    resetModal,
    validateInput,
  }
}
