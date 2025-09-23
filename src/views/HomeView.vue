<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PostCard from '@/components/PostCard.vue'
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Welcome to Code Editor
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        A modern web-based code editor built with Vue.js and TypeScript. 
        Create, edit, and manage your HTML, CSS, and JavaScript files with syntax highlighting and more.
      </p>
      
      <div class="flex justify-center space-x-4">
        <RouterLink 
          to="/editor" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg"
        >
          Start Coding
        </RouterLink>
        <RouterLink 
          to="/about" 
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          Learn More
        </RouterLink>
      </div>
    </div>

    <!-- Features Section -->
    <div class="grid md:grid-cols-3 gap-8 mb-16">
      <div class="text-center p-6 bg-white rounded-lg shadow-md">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Syntax Highlighting</h3>
        <p class="text-gray-600">Built-in syntax highlighting for HTML, CSS, and JavaScript files.</p>
      </div>

      <div class="text-center p-6 bg-white rounded-lg shadow-md">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">File Explorer</h3>
        <p class="text-gray-600">Tree-view file explorer similar to VS Code for easy navigation.</p>
      </div>

      <div class="text-center p-6 bg-white rounded-lg shadow-md">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Multi-Tab Support</h3>
        <p class="text-gray-600">Work with multiple files simultaneously using tabbed interface.</p>
      </div>
    </div>

    <!-- Demo Component -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Sample Component</h2>
      <div class="max-w-md mx-auto">
        <PostCard title="Welcome to the Code Editor!" />
      </div>
    </div>
  </div>
</template>
