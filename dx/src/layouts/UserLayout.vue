<script setup>
import Header from "@/layouts/Header.vue";
import { defineProps } from "vue";

const props = defineProps({
  isLoggedIn: Boolean, // App.vue에서 전달받음
});
</script>

<template>
  <Header :isLoggedIn="props.isLoggedIn" />
  <main>
    <router-view />
  </main>
</template>
