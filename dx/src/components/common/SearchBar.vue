<script setup>
import { ref, defineProps, defineEmits } from "vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import Button from "./Button.vue";


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
