<script setup>
import Header from "@/layouts/Header.vue";
import { useRoute } from "vue-router";


const route = useRoute();


</script>

<template>
  <Header class="auth-header" />
  <main class="main">
    <router-view />
  </main>
</template>
