<script setup>
import { ref, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import calendarIcon from "@/assets/image/icon/calendar_icon.svg";

const props = defineProps({
  modelValue: {
    type: Array, // [startDate, endDate]
    default: () => []
  },
  placeholder: {
    type: String,
    default: '기간 선택'
  },
});

const emit = defineEmits(['update:modelValue'])

const internalRange = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  internalRange.value = val;
})

const onRangeSelect = (range) => {
  emit('update:modelValue', range)
}
</script>

<template>
  <div class="date-picker-wrapper">
    <VueDatePicker v-model="internalRange" range :teleport="false" :format="'yyyy-MM-dd'" :enable-time-picker="false"
      :auto-apply="true" @update:modelValue="onRangeSelect" @open="$emit('focus')" @closed="$emit('blur')">
      <template #trigger>
        <div class="input-wrapper">
          <input type="text" class="date-input" :value="internalRange?.length === 2
            ? `${dayjs(internalRange[0]).format('YYYY-MM-DD')} ~ ${dayjs(internalRange[1]).format('YYYY-MM-DD')}`
            : ''" readonly :placeholder="placeholder" @focus="$emit('focus')" @blur="$emit('blur')" />
          <img :src="calendarIcon" class="calendarIcon" />
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>
