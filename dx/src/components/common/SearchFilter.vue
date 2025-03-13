<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
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

const selectedOption = ref(props.options.length ? props.options[0] : "");
const searchQuery = ref("");

const emits = defineEmits(["updateFilter"]);

const updateFilter = () => {
  emits("updateFilter", {
    filter: selectedOption.value,
    query: searchQuery.value,
  });
};

// 드롭다운에서 선택한 값 업데이트
const handleDropdownUpdate = (value) => {
  selectedOption.value = value;
  updateFilter();
};

watch(searchQuery, updateFilter);
</script>

<template>
  <div class="search-bar">
    <!-- 기존 select 태그 대신 DropdownMenu 사용 -->
    <DropdownMenu v-model="selectedOption" :options="options" type="radio" placeholder="필터를 선택하세요"
      @update:modelValue="handleDropdownUpdate" :arrowIcon="customArrowIcon" />
    <div class="search-wrap">
      <!-- 검색 입력 필드 -->
      <Input v-model="searchQuery" placeholder="검색어를 입력해주세요." class="search-input" />

      <!-- 검색 버튼 -->
      <Button :icon="faSearch" @click="updateFilter" class="search-btn" />
    </div>
  </div>
</template>
