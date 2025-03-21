<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted, watch, nextTick } from 'vue';
import arrow from '@/assets/image/icon/down_arrow.svg';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: [Array, String], // `modelValue`가 배열 또는 문자열일 수 있음
  placeholder: {
    type: String,
    default: "선택해주세요."
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
});

const emits = defineEmits(["update:modelValue", "validateField"]);

const showDropdown = ref(false);
const dropdownRef = ref(null);
const dropdownMenuRef = ref(null);
const dropdownPosition = ref("bottom");

// 선택된 텍스트 표시 (플레이스홀더 포함)
const selectedText = computed(() => {
  if (!props.modelValue || (Array.isArray(props.modelValue) && props.modelValue.length === 0)) {
    return props.placeholder;
  }
  return Array.isArray(props.modelValue) ? props.modelValue.join(", ") : props.modelValue.toString();
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
    if (props.modelValue !== option) {
      emits("update:modelValue", option);
      emits("validateField", option);
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
        <li v-for="option in options" :key="option" class="list">
          <label>
            <div class="item">
              <input :type="type" :value="option" :disabled="isDisabled"
                :checked="type === 'radio' ? modelValue === option : (Array.isArray(modelValue) && modelValue.includes(option))"
                @change="selectOption(option)" />
              {{ option }}
            </div>
          </label>
        </li>
      </ul>
    </div>

    <p v-show="errorMessage" class="ipt-error" role="alert">{{ errorMessage }}</p>
  </div>
</template>
