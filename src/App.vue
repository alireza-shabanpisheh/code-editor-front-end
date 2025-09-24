<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import ErrorHandler from '@/components/ErrorHandler.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const editorStore = useEditorStore()

// بارگذاری اولیه داده‌ها هنگام شروع برنامه
onMounted(async () => {
  // ابتدا وضعیت تب‌ها را بازیابی می‌کنیم (شامل بازیابی محتوای فایل‌ها از سرور)
  await editorStore.restoreTabsState()
  // سپس درخت فایل‌ها را بارگذاری می‌کنیم
  await editorStore.loadFileTree()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Navigation (only show on non-editor routes) -->
    <header v-if="$route.name !== 'code-editor'" class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <h1 class="text-2xl font-bold text-gray-900">My Project</h1>
            <div class="flex space-x-4">
              <RouterLink to="/"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50">
                Home
              </RouterLink>
              <RouterLink to="/about"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50">
                About
              </RouterLink>
            </div>
          </div>

          <div>
            <RouterLink to="/editor"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Open Code Editor
            </RouterLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>

    <!-- Global Components -->
    <ErrorHandler />
    <LoadingSpinner />
  </div>
</template>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
