<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'
import calendarIcon from '@/assets/image/icon/calendar_icon.svg'

import ko from 'date-fns/locale/ko'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '날짜 범위 선택'
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
const internalRange = ref([...props.modelValue])

watch(() => props.modelValue, (val) => {
  internalRange.value = val
})

const onRangeSelect = (range) => {
  emit('update:modelValue', range)
}

</script>

<template>
  <div class="date-picker-wrapper">
    <VueDatePicker v-model="internalRange" range locale="ko" :teleport="false" :format="'yyyy-MM-dd '"
      :enable-time-picker="false" :auto-apply="false" :min-date="internalRange[0] ?? undefined" :cancel-text="'취소'"
      :select-text="'확인'" @update:modelValue="onRangeSelect" @open="$emit('focus')" @closed="$emit('blur')">
      <template #trigger>
        <div class="input-range-wrapper">
          <!-- 시작일 인풋 -->
          <div class="input-wrapper">
            <input type="text" class="date-input"
              :value="internalRange[0] ? dayjs(internalRange[0]).format('YYYY-MM-DD') : ''" readonly
              placeholder="시작일 선택" @focus="$emit('focus')" @blur="$emit('blur')" />
            <img :src="calendarIcon" class="calendarIcon" />
          </div>

          <span class="date-separator">~</span>

          <!-- 종료일 인풋 -->
          <div class="input-wrapper">
            <input type="text" class="date-input"
              :value="internalRange[1] ? dayjs(internalRange[1]).format('YYYY-MM-DD') : ''" readonly
              placeholder="종료일 선택" @focus="$emit('focus')" @blur="$emit('blur')" />
            <img :src="calendarIcon" class="calendarIcon" />
          </div>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>
