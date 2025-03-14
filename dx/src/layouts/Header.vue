<script setup>
import { computed, defineProps } from "vue";
import "@/assets/styles/header.scss";
import TopNav from "@/layouts/common/TopNav.vue";
import MainNav from "@/layouts/common/MainNav.vue";

// ✅ `isLoggedIn` 기본값을 false로 설정
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

// ✅ `computed`로 클래스 적용 (더 안전한 방식)
const headerClass = computed(() => ({
  "guest-nav": !props.isLoggedIn,
}));
</script>

<template>
  <header class="header-wrap" :class="headerClass">
    <TopNav />
    <!-- ✅ `isLoggedIn`이 true일 때만 MainNav 렌더링 -->
    <MainNav v-if="isLoggedIn" />
  </header>
</template>
