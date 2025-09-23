<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show" class="fixed inset-0 z-50 flex items-start justify-center pt-5"
                @click.self="handleOverlayClick">
                <Transition enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4">
                    <div v-if="show"
                        class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden border border-gray-200">
                        <!-- Header -->
                        <div class="px-4 py-3 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h3 class="text-base font-medium text-gray-900">
                                    {{ title }}
                                </h3>
                                <button @click="handleCancel"
                                    class="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="px-4 py-4">
                            <div>
                                <input ref="inputRef" v-model="inputValue" :type="inputType" :placeholder="placeholder"
                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    @keyup.enter="handleConfirm" @keyup.escape="handleCancel" />
                                <p v-if="errorMessage" class="mt-2 text-xs text-red-600">
                                    {{ errorMessage }}
                                </p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
                            <button @click="handleCancel"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                                Cancel
                            </button>
                            <button @click="handleConfirm" :disabled="!canConfirm"
                                class="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {{ confirmText }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

interface Props {
    show: boolean
    title: string
    placeholder?: string
    inputType?: string
    confirmText?: string
    validator?: (value: string) => string | null
}

const props = withDefaults(defineProps<Props>(), {
    inputType: 'text',
    confirmText: 'Create',
    placeholder: ''
})

const emit = defineEmits<{
    confirm: [value: string]
    cancel: []
}>()

const inputRef = ref<HTMLInputElement>()
const inputValue = ref('')
const errorMessage = ref('')

const canConfirm = computed(() => {
    return inputValue.value.trim().length > 0 && !errorMessage.value
})

function handleConfirm() {
    if (!canConfirm.value) return

    const value = inputValue.value.trim()
    if (props.validator) {
        const error = props.validator(value)
        if (error) {
            errorMessage.value = error
            return
        }
    }

    emit('confirm', value)
    resetModal()
}

function handleCancel() {
    emit('cancel')
    resetModal()
}

function handleOverlayClick() {
    handleCancel()
}

function resetModal() {
    inputValue.value = ''
    errorMessage.value = ''
}

// Focus input when modal opens
watch(() => props.show, (newShow) => {
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
</script>