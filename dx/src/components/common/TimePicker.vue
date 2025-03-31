<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  hours: Number,
  minutes: Number
});
const emit = defineEmits(['update:hours', 'update:minutes']);

const selectedHours = ref(props.hours ?? new Date().getHours());
const selectedMinutes = ref(props.minutes ?? new Date().getMinutes());

// 외부 변경 감지 → 내부 반영
watch(() => props.hours, val => {
  if (val !== null && val !== undefined) selectedHours.value = val;
});
watch(() => props.minutes, val => {
  if (val !== null && val !== undefined) selectedMinutes.value = val;
});

// 내부 변경 → 외부 반영
watch(selectedHours, val => emit('update:hours', val));
watch(selectedMinutes, val => emit('update:minutes', val));
</script>

<template>
  <div class="custom-time-picker">
    <select class="time-select" v-model="selectedHours" @keydown.enter.prevent>
      <option v-for="h in 24" :key="h" :value="h">{{ h.toString().padStart(2, '0') }}</option>
    </select>
    :
    <select class="time-select" v-model="selectedMinutes" @keydown.enter.prevent>
      <option v-for="m in 60" :key="m - 1" :value="m - 1">{{ (m - 1).toString().padStart(2, '0') }}</option>
    </select>
  </div>
</template>
