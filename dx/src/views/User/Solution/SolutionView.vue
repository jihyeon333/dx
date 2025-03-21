<script setup>
import "@/assets/styles/views/view.scss";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

</script>

<template>
  <router-view />
</template>
