<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import "@/assets/styles/header.scss";
import TopNav from "@/layouts/common/TopNav.vue";
import MainNav from "@/layouts/common/MainNav.vue";

const route = useRoute()

const headerClass = computed(() => {
  if (route.path.startsWith("/admin")) return "admin-header";
  if (route.path.startsWith("/user")) return "user-header";
  if (route.path.startsWith("/auth")) return "auth-header";
  return "default-header"; // 기본 레이아웃
});
</script>

<template>
  <header class="header-wrap" :class="headerClass">
    <TopNav />
    <!-- ✅ `isLoggedIn`이 true일 때만 MainNav 렌더링 -->
    <MainNav />
  </header>
</template>
