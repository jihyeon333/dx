<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: [String, Number, Array], // 선택된 값 (라디오: 단일 값, 체크박스: 배열)
  options: {
    type: Array,
    required: true, // { label: "옵션명", value: "값" } 형태의 배열
  },
  name: {
    type: String,
    required: true, // 그룹화를 위한 name 속성
  },
  type: {
    type: String,
    default: "radio", // 기본값: "radio"
    validator: (value) => ["radio", "checkbox"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue"]);

// 값 업데이트 함수
const updateValue = (value) => {
  if (props.type === "radio") {
    emit("update:modelValue", value);
  } else if (props.type === "checkbox") {
    const newValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = newValue.indexOf(value);

    if (index === -1) {
      newValue.push(value); // 체크박스 선택 추가
    } else {
      newValue.splice(index, 1); // 체크박스 선택 해제
    }

    emit("update:modelValue", newValue);
  }
};

// 체크 상태 확인 (체크박스 전용)
const isChecked = (value) => {
  return props.type === "checkbox"
    ? Array.isArray(props.modelValue) && props.modelValue.includes(value)
    : props.modelValue === value;
};
</script>

<template>
  <div class="radio-checkbox-group">
    <label v-for="option in options" :key="option.value" class="radio-checkbox-label">
      <input :type="type" :name="type === 'radio' ? name : `${name}-${option.value}`" :value="option.value"
        :checked="isChecked(option.value)" @change="updateValue(option.value)" class="radio-checkbox-input none" />
      <span class="radio-checkbox-custom"></span>
      <p>{{ option.label }}</p>
    </label>
  </div>
</template>
