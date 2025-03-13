<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted, watch, nextTick } from 'vue';
import arrow from '@/assets/image/icon/down_arrow.svg';  // 기본 화살표 아이콘

const props = defineProps({
  options: Array,
  modelValue: [Array, String],
  placeholder: {
    type: String,
    default: "회원형태를 선택해주세요."
  },
  errorMessage: String,
  type: {
    type: String,
    default: "checkbox",
    validator: (value) => ["checkbox", "radio"].includes(value)
  },
  arrowIcon: {  // 화살표 아이콘을 prop으로 받기
    type: String,
    default: arrow // 기본값은 기존 화살표 아이콘
  }
});

const emits = defineEmits(['update:modelValue', 'validateField']);

const showDropdown = ref(false);
const dropdownRef = ref(null);
const dropdownMenuRef = ref(null);
const dropdownPosition = ref('bottom');

//선택된 값이 없으면 빈 문자열 반환 → placeholder 유지
const selectedText = computed(() => {
  if (props.type === "radio") {
    return props.modelValue ? props.modelValue : '';
  }
  return (Array.isArray(props.modelValue) && props.modelValue.length > 0) ? props.modelValue.join(', ') : '';
});

//드롭다운 토글 상태에 따라 화살표 회전 클래스 적용
const arrowClass = computed(() => ({ 'rotate': showDropdown.value }));

//드롭다운 위치 자동 조정
const adjustDropdownPosition = () => {
  if (!dropdownRef.value || !dropdownMenuRef.value) return;

  nextTick(() => {
    const dropdownRect = dropdownRef.value.getBoundingClientRect();
    const menuHeight = dropdownMenuRef.value.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (dropdownRect.bottom + menuHeight > viewportHeight) {
      dropdownPosition.value = 'top';
    } else {
      dropdownPosition.value = 'bottom';
    }
  });
};

//드롭다운 열기/닫기
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    adjustDropdownPosition();
  }
};

//옵션 선택 처리
const selectOption = (option) => {
  if (props.type === "radio") {
    emits('update:modelValue', option);
    emits('validateField', option);
    showDropdown.value = false;
  } else {
    let updatedValues = [...props.modelValue];

    if (updatedValues.includes(option)) {
      updatedValues = updatedValues.filter(item => item !== option);
    } else {
      updatedValues.push(option);
    }

    emits('update:modelValue', updatedValues);
    emits('validateField', updatedValues);
  }
};

watch(() => props.modelValue, (newValue) => {
  emits('validateField', newValue);
});

//외부 클릭 시 드롭다운 닫기
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', adjustDropdownPosition); // 화면 크기 변경 시 위치 조정
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', adjustDropdownPosition);
});
</script>

<template>
  <div class="dropdown-container" ref="dropdownRef">
    <div class="dropdown-input" :class="{ error: errorMessage }" @click="toggleDropdown">
      <input type="text" :value="selectedText" :placeholder="placeholder" readonly />
      <!--화살표 아이콘 추가 (회전 적용) -->
      <div class="arrow" :class="arrowClass">
        <img :src="arrowIcon" alt="화살표">
      </div>
    </div>

    <div v-show="showDropdown" class="dropdown-menu" :class="[dropdownPosition]" ref="dropdownMenuRef">
      <ul class="menu-list">
        <li v-for="option in options" :key="option" class="list">
          <label>
            <div class="item">
              <input :type="type" :value="option"
                :checked="type === 'radio' ? modelValue === option : modelValue.includes(option)"
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
