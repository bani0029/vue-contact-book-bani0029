<script setup>
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f2f5;
  color: #1a1a2e;
  line-height: 1.6;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  background: linear-gradient(180deg, #e8f4f8 0%, #f0f2f5 50%, #faf9f7 100%);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Better text rendering */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Selection color */
::selection {
  background: #6366f1;
  color: white;
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Link styles */
a {
  color: #6366f1;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #4f46e5;
}
</style>
