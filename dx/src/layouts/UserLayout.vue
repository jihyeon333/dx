<script setup>
import Header from "@/layouts/Header.vue";
import { defineProps, computed } from "vue";
import { useRoute } from 'vue-router';

const props = defineProps({
  isLoggedIn: Boolean, // App.vue에서 전달받음
});

const route = useRoute();

const isParameterRegistrationPage = computed(() => {
  return route.name === 'SolutionParams';
});

const headerClass = computed(() => {
  return isParameterRegistrationPage.value ? 'parameter' : '';
});

</script>

<template>
<div>
  <Header :isLoggedIn="props.isLoggedIn" :class="headerClass" />
  <main>
    <router-view />
  </main>
  </div>
</template>
