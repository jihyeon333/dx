<script setup>
import { ref, watch, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import calendarIcon from '@/assets/image/icon/calendar_icon.svg';
import ko from 'date-fns/locale/ko';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [null, null],
  },
  enableTime: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '날짜를 선택하세요',
  }
});

const emit = defineEmits(['update:modelValue']);

const startDate = ref(props.modelValue[0]);
const endDate = ref(props.modelValue[1]);
const hoverDate = ref(null);

watch(() => props.modelValue, (val) => {
  startDate.value = val[0]
  endDate.value = val[1]
});

watch([startDate, endDate], ([start, end]) => {
  emit('update:modelValue', [start, end])
});

watch(endDate, () => {
  hoverDate.value = null
});

const highlightedDates = computed(() => {
  const range = []

  if (!startDate.value) return range

  const from = dayjs(startDate.value)
  const to = dayjs(endDate.value || hoverDate.value || startDate.value)

  const [min, max] = from.isBefore(to) ? [from, to] : [to, from]
  let current = min.clone()

  while (current.isSame(max, 'day') || current.isBefore(max)) {
    range.push(current.toDate())
    current = current.add(1, 'day')
  }

  return range
});


const getCustomClass = (date) => {
  const d = dayjs(date);
  if (startDate.value && d.isSame(startDate.value, 'day')) return 'custom-start';
  if (endDate.value && d.isSame(endDate.value, 'day')) return 'custom-end';
  if (
    startDate.value &&
    endDate.value &&
    d.isAfter(dayjs(startDate.value), 'day') &&
    d.isBefore(dayjs(endDate.value), 'day')
  ) return 'custom-range';

  return '';
};


</script>

<template>
  <div class="date-range-wrapper">
    <!-- 시작일 -->
    <VueDatePicker v-model="startDate" :locale="ko" :enable-time-picker="enableTime" :highlight="highlightedDates"
      :format="enableTime ? 'yyyy-MM-dd HH:mm a' : 'yyyy-MM-dd'"
      :preview-format="enableTime ? 'yyyy-MM-dd HH:mm a' : 'yyyy-MM-dd'" :teleport="false" :auto-apply="false"
      :cancel-text="'취소'" :select-text="'확인'" :custom-class="getCustomClass" time-picker-inline>
      <template #trigger>
        <div class="input-wrapper">
          <input type="text" class="date-input"
            :value="startDate ? dayjs(startDate).format(enableTime ? 'YYYY-MM-DD hh:mm A' : 'YYYY-MM-DD') : ''"
            placeholder="시작일 선택" readonly />
          <img :src="calendarIcon" class="calendarIcon" />
        </div>
      </template>
    </VueDatePicker>

    <span class="date-separator">~</span>

    <!-- 종료일 -->
    <VueDatePicker v-model="endDate" :locale="ko" :enable-time-picker="enableTime" :highlight="highlightedDates"
      :format="enableTime ? 'yyyy-MM-dd HH:mm a' : 'yyyy-MM-dd'"
      :preview-format="enableTime ? 'yyyy-MM-dd HH:mm a' : 'yyyy-MM-dd'" :teleport="false" :auto-apply="false"
      :min-date="startDate" :cancel-text="'취소'" :select-text="'확인'" :custom-class="getCustomClass" time-picker-inline
      @hover-date="hoverDate = $event" :start-date="startDate">
      <template #trigger>
        <div class="input-wrapper">
          <input type="text" class="date-input"
            :value="endDate ? dayjs(endDate).format(enableTime ? 'YYYY-MM-DD hh:mm A' : 'YYYY-MM-DD') : ''"
            placeholder="종료일 선택" readonly />
          <img :src="calendarIcon" class="calendarIcon" />
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>
