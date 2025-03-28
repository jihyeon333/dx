<script setup>
const props = defineProps({
  value: String,
});


const badgeClass = computed(() => {
  switch (props.value) {
    case "진행중":
      return "status-active";
    case "중지":
      return "status-paused";
    default:
      return "status-default";
  }
});
</script>

<template>
  <span class="badge" :class="badgeClass">
    {{ value }}
  </span>
</template>
