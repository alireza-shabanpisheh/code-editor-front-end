<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Welcome to Code Editor
      </h1>
      <div class="flex justify-center space-x-4">
        <RouterLink to="/editor"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg">
          Start Coding
        </RouterLink>
        <RouterLink to="/about"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium transition-colors">
          Learn More
        </RouterLink>
      </div>
    </div>
  </div>
</template>
