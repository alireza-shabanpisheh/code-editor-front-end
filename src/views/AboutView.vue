<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">About Code Editor</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        A modern, web-based code editor inspired by VS Code, built with cutting-edge technologies.
      </p>
    </div>

    <!-- Technology Stack -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Stack</h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="text-center p-4 border border-gray-200 rounded-lg">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-green-600 font-bold text-lg">V</span>
          </div>
          <h3 class="font-semibold text-gray-900">Vue.js 3</h3>
          <p class="text-sm text-gray-600">Progressive JavaScript framework</p>
        </div>

        <div class="text-center p-4 border border-gray-200 rounded-lg">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-blue-600 font-bold text-lg">TS</span>
          </div>
          <h3 class="font-semibold text-gray-900">TypeScript</h3>
          <p class="text-sm text-gray-600">Typed JavaScript at scale</p>
        </div>

        <div class="text-center p-4 border border-gray-200 rounded-lg">
          <div class="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-cyan-600 font-bold text-lg">T</span>
          </div>
          <h3 class="font-semibold text-gray-900">Tailwind CSS</h3>
          <p class="text-sm text-gray-600">Utility-first CSS framework</p>
        </div>

        <div class="text-center p-4 border border-gray-200 rounded-lg">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-yellow-600 font-bold text-lg">P</span>
          </div>
          <h3 class="font-semibold text-gray-900">Pinia</h3>
          <p class="text-sm text-gray-600">State management for Vue</p>
        </div>

        <div class="text-center p-4 border border-gray-200 rounded-lg">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-purple-600 font-bold text-lg">V</span>
          </div>
          <h3 class="font-semibold text-gray-900">Vite</h3>
          <p class="text-sm text-gray-600">Next generation frontend tooling</p>
        </div>

        <div class="text-center p-4 border border-gray-200 rounded-lg">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-gray-600 font-bold text-lg">VR</span>
          </div>
          <h3 class="font-semibold text-gray-900">Vue Router</h3>
          <p class="text-sm text-gray-600">Official router for Vue.js</p>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="bg-gray-50 rounded-lg p-8 mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">File Management</h3>
            <p class="text-gray-600">Create, open, edit, and save HTML, CSS, and JavaScript files</p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Syntax Highlighting</h3>
            <p class="text-gray-600">Color-coded syntax highlighting for better code readability</p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Multi-Tab Interface</h3>
            <p class="text-gray-600">Work with multiple files simultaneously using tabs</p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Tree View Explorer</h3>
            <p class="text-gray-600">VS Code-like file explorer with folder structure</p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Keyboard Shortcuts</h3>
            <p class="text-gray-600">Familiar shortcuts like Ctrl+S to save and Ctrl+N for new file</p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Responsive Design</h3>
            <p class="text-gray-600">Works seamlessly across different screen sizes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Ready to Start Coding?</h2>
      <p class="text-gray-600 mb-6">Experience the power of a modern web-based code editor</p>
      <router-link 
        to="/editor" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg inline-block"
      >
        Open Code Editor
      </router-link>
    </div>
  </div>
</template>

<style scoped>
</style>
