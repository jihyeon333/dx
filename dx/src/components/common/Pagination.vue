<script setup>
import { defineEmits } from "vue";

const emits = defineEmits(["prev", "next"]);
</script>

<template>
  <div class="pagination">
    <button @click="emits('prev')">&laquo; 이전</button>
    <span>1 / 10</span>
    <button @click="emits('next')">다음 &raquo;</button>
  </div>
</template>
