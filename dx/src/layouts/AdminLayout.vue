<script setup>
import Header from "@/layouts/Header.vue";
</script>

<template>
  <div class="admin-layout">
    <Header class="admin-header" />
    <main>
      <router-view />
    </main>
  </div>
</template>
