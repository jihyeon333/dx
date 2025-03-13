<script setup>
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
import DropdownMenu from "./DropdownMenu.vue";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';

import { faSearch } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});

//  초기값: options의 첫 번째 `value` 값 저장
const selectedValue = ref(props.options.length ? props.options[0].value : "");
const searchQuery = ref("");

//  선택된 `value`에 해당하는 `label` 찾기
const selectedLabel = computed(() => {
  const found = props.options.find(opt => opt.value === selectedValue.value);
  return found ? found.label : "";
});

const emits = defineEmits(["updateFilter"]);

//  `updateFilter`는 `value` 값만 전달
const updateFilter = () => {
  emits("updateFilter", {
    filter: selectedValue.value, //  내부적으로 저장하는 값은 영어
    query: searchQuery.value,
  });
};

//  드롭다운에서 선택한 값 업데이트
const handleDropdownUpdate = (label) => {
  const found = props.options.find(opt => opt.label === label);
  if (found) {
    selectedValue.value = found.value; //  영어 값 저장
    updateFilter();
  }
};

//  검색어 변경 시 자동 필터 업데이트
watch(searchQuery, updateFilter);
</script>

<template>
  <div class="search-bar">
    <!--  한글(label) 표시, 실제 값(value) 저장 -->
    <DropdownMenu v-model="selectedLabel" :options="options.map(opt => opt.label)" type="radio" placeholder="필터를 선택하세요"
      @update:modelValue="handleDropdownUpdate" :arrowIcon="customArrowIcon" />

    <div class="search-wrap">
      <!-- 검색 입력 필드 -->
      <Input v-model="searchQuery" placeholder="검색어를 입력해주세요." class="search-input" />

      <!-- 검색 버튼 -->
      <Button :icon="faSearch" @click="updateFilter" class="search-btn" />
    </div>
  </div>
</template>
