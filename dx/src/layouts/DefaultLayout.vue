<script setup>
import { computed, defineProps } from "vue";
import Header from "@/layouts/Header.vue";
import { useRoute } from "vue-router";

const props = defineProps({
  isLoggedIn: Boolean,
});

const route = useRoute();

const isGuestPage = computed(() => route.path.startsWith("/auth"));

const headerClass = computed(() => ({
  "guest-nav": isGuestPage.value,
}));
</script>

<template>
  <Header :class="headerClass" :isLoggedIn="props.isLoggedIn" />
  <main class="main">
    <router-view />
  </main>
</template>
