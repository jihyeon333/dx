<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';

const props = defineProps({
  items: Array, // { name, path } 형태
  showDropdown: Boolean,
  dropdownOptions: Array,
  modelValue: String
});

const emit = defineEmits(['update:selectedView']);

const selected = ref(props.modelValue || props.dropdownOptions?.[0] || '');

watch(() => props.modelValue, (val) => {
  if (val !== selected.value) selected.value = val;
});

watch(selected, (val) => {
  emit('update:selectedView', val);
});

const router = useRouter();
</script>

<template>
  <nav class="breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <span class="breadcrumb-item">
        <router-link v-if="item.path" :to="item.path">{{ item.name }}</router-link>
        <span v-else>{{ item.name }}</span>
      </span>
    </template>

    <!-- 마지막 요소: 드롭다운 -->
    <span class="breadcrumb-item">
      <DropdownMenu v-if="showDropdown" v-model="selected" :options="dropdownOptions" type="radio"
        :arrowIcon="customArrowIcon" class="ml-2" />
    </span>
  </nav>
</template>
