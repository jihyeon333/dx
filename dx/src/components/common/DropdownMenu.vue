<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted, watch, nextTick } from 'vue';
import arrow from '@/assets/image/icon/down_arrow.svg';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: [Array, String, Number], // `modelValue`가 배열 또는 문자열일 수 있음
  placeholder: {
    type: String,
    default: "선택"
  },
  errorMessage: String,
  type: {
    type: String,
    default: "radio",
    validator: (value) => ["checkbox", "radio"].includes(value)
  },
  arrowIcon: {
    type: String,
    default: arrow
  },
  isDisabled: Boolean,

  optionLabel: {
    type: String,
    default: "label" // 기본 label 키 (또는 name)
  },
  optionValue: {
    type: String,
    default: "value"
  },
  mode: {
    type: String,
    default: "default", // default | pagination
    validator: (val) => ["default", "pagination"].includes(val)
  }

});



const emits = defineEmits(["update:modelValue", "validateField"]);

const showDropdown = ref(false);
const dropdownRef = ref(null);
const dropdownMenuRef = ref(null);
const dropdownPosition = ref("bottom");

// 선택된 텍스트 표시 (플레이스홀더 포함)
const selectedText = computed(() => {
  const isEmpty =
    props.modelValue === null ||
    props.modelValue === undefined ||
    (Array.isArray(props.modelValue) && props.modelValue.length === 0);

  // pagination 모드는 값만 바로 출력
  if (props.mode === 'pagination') {
    return isEmpty ? props.placeholder : String(props.modelValue);
  }

  if (isEmpty) return props.placeholder;

  const extractLabel = (val) => {
    const found = props.options.find((opt) =>
      typeof opt === "object"
        ? String(opt[props.optionValue]) === String(val)
        : String(opt) === String(val)
    );
    return typeof found === "object" ? found[props.optionLabel] : found ?? props.placeholder;
  };

  return Array.isArray(props.modelValue)
    ? props.modelValue.map(extractLabel).join(", ")
    : extractLabel(props.modelValue);
});

// 플레이스홀더 여부 확인
const isPlaceholder = computed(() => selectedText.value === props.placeholder);

// 드롭다운 화살표 회전 클래스
const arrowClass = computed(() => ({ rotate: showDropdown.value }));

// 드롭다운 위치 자동 조정
const adjustDropdownPosition = () => {
  if (!dropdownRef.value || !dropdownMenuRef.value) return;
  nextTick(() => {
    const dropdownRect = dropdownRef.value.getBoundingClientRect();
    const menuHeight = dropdownMenuRef.value.offsetHeight;
    const viewportHeight = window.innerHeight;

    dropdownPosition.value = dropdownRect.bottom + menuHeight > viewportHeight ? "top" : "bottom";
  });
};

// 드롭다운 열기/닫기
const toggleDropdown = () => {
  if (props.isDisabled) return;
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    adjustDropdownPosition();
  }
};

// 옵션 선택 로직 개선
const selectOption = (option) => {
  if (props.isDisabled) return;

  if (props.type === "radio") {
    const selected = typeof option === 'object' ? option[props.optionValue] : option;
    if (props.modelValue !== selected) {
      emits("update:modelValue", selected);
      emits("validateField", selected);
    }
    showDropdown.value = false;
  } else {
    let updatedValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    updatedValues = updatedValues.includes(option)
      ? updatedValues.filter((item) => item !== option)
      : [...updatedValues, option];

    emits("update:modelValue", updatedValues);
    emits("validateField", updatedValues);
  }
};

// `modelValue` 변경 시 검증 이벤트 발생
watch(
  () => props.modelValue,
  (newValue) => {
    emits("validateField", newValue);
  }
);

// 외부 클릭 시 드롭다운 닫기
const handleClickOutside = (event) => {
  if (!event.target || !dropdownRef.value || dropdownRef.value.contains(event.target)) return;
  showDropdown.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", adjustDropdownPosition);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", adjustDropdownPosition);
});
</script>

<template>
  <div class="dropdown-container" ref="dropdownRef">
    <div class="dropdown-input" :class="{ error: errorMessage, 'is-disabled': isDisabled, placeholder: isPlaceholder }"
      @click="toggleDropdown">
      <input type="text" :value="selectedText" readonly :disabled="isDisabled" />
      <div class="arrow">
        <img :src="arrowIcon" alt="화살표" />
      </div>
    </div>

    <div v-show="showDropdown && !isDisabled" class="dropdown-menu" :class="[dropdownPosition]" ref="dropdownMenuRef">
      <ul class="menu-list">
        <li v-for="option in options" :key="typeof option === 'object' ? option[optionValue] : option" class="list">
          <label>
            <div class="item">
              <input :type="type" :value="typeof option === 'object' ? option[optionValue] : option" :checked="type === 'radio'
                ? modelValue === (typeof option === 'object' ? option[optionValue] : option)
                : (Array.isArray(modelValue) && modelValue.includes(typeof option === 'object' ? option[optionValue] : option))
                " @change="selectOption(typeof option === 'object' ? option[optionValue] : option)" />
              {{ typeof option === 'object' ? option[optionLabel] : option }}
            </div>
          </label>
        </li>
      </ul>
    </div>

    <p v-show="errorMessage" class="ipt-error" role="alert">{{ errorMessage }}</p>
  </div>
</template>
