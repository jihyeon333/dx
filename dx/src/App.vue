<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLoadingStore } from '@/stores/loadingStore';
import { storeToRefs } from 'pinia';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);

const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem("userToken"));

onMounted(() => {
    isLoggedIn.value = !!localStorage.getItem("userToken");
});


const handleLogin = () => {
    localStorage.setItem("userToken", "mock-token");
    isLoggedIn.value = true;
};


const handleLogout = () => {
    localStorage.removeItem("userToken");
    isLoggedIn.value = false;
    router.push("/auth/login");
};


window.addEventListener("storage", () => {
    isLoggedIn.value = !!localStorage.getItem("userToken");
});
</script>

<template>
    <LoadingSpinner v-if="isLoading" />
    <!-- 로그인 상태를 `router-view`와 `Header`에 전달 -->
    <router-view :isLoggedIn="isLoggedIn" @login="handleLogin" @logout="handleLogout" />
</template>
