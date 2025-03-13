<script setup>
defineProps({
  text: { type: String, required: true },
});
</script>

<template>
  <div class="title">
    <h4>{{ text }}</h4>
  </div>
</template>
