<script setup>
import { ref, defineProps, defineEmits } from "vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import Button from "./Button.vue";

import upIcon from "@/assets/image/icon/"

defineProps({
  filterOptions: {
    type: Array,
    required: true,
  },
  buttons: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const selectedFilter = ref("");
const searchQuery = ref("");

const emits = defineEmits(["filterChange", "buttonClick"]);

//  버튼 클릭 이벤트 핸들러 추가
const handleButtonClick = (button) => {
  if (button.onClick) {
    button.onClick(); // 버튼의 클릭 이벤트 실행
  }
  emits("buttonClick", button); // 부모 컴포넌트로 이벤트 전달
};

const handleFilterUpdate = (data) => {
  selectedFilter.value = data.filter;
  searchQuery.value = data.query;
  emits("filterChange", data);
};
</script>

<template>
  <div class="search-bar-wrapper">
    <div class="buttons">
      <Button v-for="(button, index) in buttons" :key="index" :label="button.label" :className="button.className"
        @click="handleButtonClick(button)" />
    </div>
    <SearchFilter :options="filterOptions" @updateFilter="handleFilterUpdate" />
  </div>
</template>
