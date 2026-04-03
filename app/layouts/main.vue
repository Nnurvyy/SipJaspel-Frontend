<template>
  <div style="display: flex; height: 100%; overflow: hidden; width: 100%;">
    <!-- SIDEBAR -->
    <LayoutMainSidebar />

    <!-- MAIN -->
    <div id="main">
      <!-- TOPBAR -->
      <LayoutMainNavbar />

      <!-- CONTENT -->
      <div id="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
/* Nuxt page transitions / animations can be applied here if needed */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
