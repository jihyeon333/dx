<script setup>
import "@/assets/styles/views/view.scss";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

// 대소문자 통일하여 비교 (Vue Router는 대소문자를 구분함)
const isSolutionPage = computed(() => route.path.toLowerCase().startsWith('/user/solution'));
</script>

<template>
  <router-view />
</template>
