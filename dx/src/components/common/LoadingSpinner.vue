<template>
  <div class="loading-backdrop">
    <div class="spinner" />
  </div>
</template>

<style scoped>
.loading-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 6px solid #ddd;
  border-top: 6px solid #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>