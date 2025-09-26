<template>
    <div v-if="error" class="error-notification">
        <div class="error-content">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
            <button @click="clearError" class="close-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

const editorStore = useEditorStore()
const { error } = storeToRefs(editorStore)
const { clearError } = editorStore
</script>

<style scoped>
.error-notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    max-width: 400px;
}

.error-content {
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #dc2626;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.error-icon {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    margin-left: auto;
    flex-shrink: 0;
}

.close-btn:hover {
    background-color: #fecaca;
}

.close-btn svg {
    width: 1rem;
    height: 1rem;
}
</style>