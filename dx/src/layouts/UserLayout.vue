<script setup>
import Header from "@/layouts/Header.vue";
import { defineProps, computed } from "vue";
import { useRoute } from "vue-router";

// ✅ `isLoggedIn`을 기본값과 함께 정의
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false, // 기본값 설정
  },
});

const route = useRoute();

// ✅ `computed`를 사용하여 `isLoggedIn` 값 관리 (더 깔끔한 방식)
const isLoggedIn = computed(() => props.isLoggedIn);
</script>

<template>
  <!-- ✅ `computed` 속성을 사용하여 `isLoggedIn`을 전달 -->
  <Header :isLoggedIn="isLoggedIn" />
  <main>
    <router-view />
  </main>
</template>
