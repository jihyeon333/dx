<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import "@/assets/styles/header.scss";
import TopNav from "@/layouts/common/TopNav.vue";
import MainNav from "@/layouts/common/MainNav.vue";

const route = useRoute();

//  로그인 여부 확인 (localStorage에서 `userToken` 체크)
const isLoggedIn = computed(() => !!localStorage.getItem("userToken"));

//  동적 헤더 클래스 설정
const headerClass = computed(() => {
  if (route.path.startsWith("/admin")) return "admin-header";
  if (route.path.startsWith("/user")) return "user-header";
  if (route.path.startsWith("/auth")) return "auth-header";
  return "default-header"; // 기본 레이아웃
});

//  마이페이지 여부 확인
const isMypage = computed(() => route.path.startsWith("/mypage") || route.path.startsWith("/admin/mypage"));
</script>

<template>
  <header class="header-wrap" :class="headerClass">
    <TopNav />
    <!--  `isLoggedIn`이 true일 때만 MainNav 렌더링 -->
    <MainNav v-if="isLoggedIn" :isMypage="isMypage" />
  </header>
</template>
