<script setup>
import { ref, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import calendarIcon from '@/assets/image/icon/calendar_icon.svg';
import TimePicker from '@/components/common/TimePicker.vue';
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
  },
});
const emit = defineEmits(['update:modelValue']);

const startDate = ref(props.modelValue[0] ? new Date(props.modelValue[0]) : null);
const endDate = ref(props.modelValue[1] ? new Date(props.modelValue[1]) : null);
const hoverDate = ref(null);

const onStartDateChange = (newDate) => {
  if (!newDate) {
    startDate.value = null;
    emit('update:modelValue', [null, endDate.value]);
    return;
  }
  const date = new Date(newDate);
  if (startDate.value) {
    date.setHours(startDate.value.getHours());
    date.setMinutes(startDate.value.getMinutes());
  } else {
    // 기존 날짜 선택 시, 시간이 없는 경우 현재 시간으로 초기화
    const now = new Date();
    date.setHours(now.getHours(), now.getMinutes(), 0);
  }
  startDate.value = date;
  emit('update:modelValue', [startDate.value, endDate.value]);
};

const onEndDateChange = (newDate) => {
  if (!newDate) {
    endDate.value = null;
    emit('update:modelValue', [startDate.value, null]);
    return;
  }
  const date = new Date(newDate);
  if (endDate.value) {
    date.setHours(endDate.value.getHours());
    date.setMinutes(endDate.value.getMinutes());
  } else {
    // 기존 날짜 선택 시, 시간이 없는 경우 현재 시간으로 초기화
    const now = new Date();
    date.setHours(now.getHours(), now.getMinutes(), 0);
  }
  endDate.value = date;
  emit('update:modelValue', [startDate.value, endDate.value]);
};

const updateStartTime = (type, val) => {
  if (!startDate.value) return; // 날짜가 없으면 시간 변경 불가능

  const updated = new Date(startDate.value);

  if (type === 'hours') updated.setHours(val);
  else updated.setMinutes(val);

  startDate.value = updated;
  emit('update:modelValue', [startDate.value, endDate.value]);
};

const updateEndTime = (type, val) => {
  if (!endDate.value) return; // 날짜가 없으면 시간 변경 불가능

  const updated = new Date(endDate.value);

  if (type === 'hours') updated.setHours(val);
  else updated.setMinutes(val);

  endDate.value = updated;
  emit('update:modelValue', [startDate.value, endDate.value]);
};
const highlightedDates = computed(() => {
  const range = [];
  if (!startDate.value) return range;

  const from = dayjs(startDate.value);
  const to = dayjs(endDate.value || hoverDate.value || startDate.value);
  const [min, max] = from.isBefore(to) ? [from, to] : [to, from];

  let current = min.clone();
  while (current.isSame(max, 'day') || current.isBefore(max)) {
    range.push(current.toDate());
    current = current.add(1, 'day');
  }
  return range;
});

const firstHighlightedDate = computed(() => {
  return highlightedDates.value.length
    ? highlightedDates.value.reduce((earliest, current) => (current < earliest ? current : earliest))
    : null;
});

const lastHighlightedDate = computed(() => {
  return highlightedDates.value.length
    ? highlightedDates.value.reduce((latest, current) => (current > latest ? current : latest))
    : null;
});

const getCustomClass = (date) => {
  const d = dayjs(date);
  if (firstHighlightedDate.value && d.isSame(firstHighlightedDate.value, 'day')) return 'custom-highlight-start';
  if (lastHighlightedDate.value && d.isSame(lastHighlightedDate.value, 'day')) return 'custom-highlight-end';
  if (startDate.value && endDate.value && d.isAfter(dayjs(startDate.value), 'day') && d.isBefore(dayjs(endDate.value), 'day')) {
    return 'custom-range';
  }
  return '';
};

const formatDate = (date) => {
  return date ? dayjs(date).format(props.enableTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') : '';
};
const previewFormat = (date) => {
  if (!date) return '';
  const d = dayjs(date);
  const dateStr = d.format('YYYY-MM-DD');
  const timeStr = d.format('HH:mm');
  return props.enableTime ? `${dateStr}\n${timeStr}` : dateStr;
};



</script>

<template>
  <div class="date-range-wrapper">
    <!-- 시작일 -->
    <VueDatePicker :model-value="startDate" @update:model-value="onStartDateChange" :locale="ko"
      :enable-time-picker="enableTime" time-picker-inline :highlight="highlightedDates"
      :format="enableTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'" :preview-format="previewFormat" :teleport="false"
      :auto-apply="false" cancel-text="취소" select-text="확인" :custom-class="getCustomClass">
      <template #trigger="{ togglePopover }">
        <div class="input-wrapper" @click="togglePopover">
          <input type="text" class="date-input" :value="formatDate(startDate)" placeholder="시작일 선택" readonly />
          <img :src="calendarIcon" class="calendarIcon" />
        </div>
      </template>

      <template #time-picker>
        <TimePicker :hours="(startDate ?? new Date()).getHours()" :minutes="(startDate ?? new Date()).getMinutes()"
          @update:hours="val => updateStartTime('hours', val)"
          @update:minutes="val => updateStartTime('minutes', val)" />
      </template>
    </VueDatePicker>

    <span class="date-separator">~</span>

    <!-- 종료일 -->
    <VueDatePicker :model-value="endDate" @update:model-value="onEndDateChange" :locale="ko"
      :enable-time-picker="enableTime" time-picker-inline :highlight="highlightedDates" :min-date="startDate"
      :format="enableTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'" :preview-format="previewFormat" :teleport="false"
      :auto-apply="false" cancel-text="취소" select-text="확인" :custom-class="getCustomClass"
      @hover-date="hoverDate = $event" :start-date="startDate">
      <template #trigger="{ togglePopover }">
        <div class="input-wrapper" @click="togglePopover">
          <input type="text" class="date-input" :value="formatDate(endDate)" placeholder="종료일 선택" readonly />
          <img :src="calendarIcon" class="calendarIcon" />
        </div>
      </template>

      <template #time-picker>
        <TimePicker :hours="(endDate ?? new Date()).getHours()" :minutes="(endDate ?? new Date()).getMinutes()"
          @update:hours="val => updateEndTime('hours', val)" @update:minutes="val => updateEndTime('minutes', val)" />
      </template>
    </VueDatePicker>
  </div>
</template>