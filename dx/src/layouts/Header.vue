<script setup>
import { computed, defineProps } from "vue";
import "@/assets/styles/header.scss";
import TopNav from "@/layouts/common/TopNav.vue";
import MainNav from "@/layouts/common/MainNav.vue";

const props = defineProps({
  isLoggedIn: Boolean,
});

const headerClass = computed(() => ({
  "guest-nav": !props.isLoggedIn,
}));


</script>

<template>
  <header class="header-wrap" :class="headerClass">
    <TopNav />
    <MainNav v-if="props.isLoggedIn" />
  </header>
</template>
