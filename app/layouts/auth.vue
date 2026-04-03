<template>
  <div class="auth-layout font-inter">
    <slot />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
}
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
