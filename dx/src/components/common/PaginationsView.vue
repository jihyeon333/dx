<script setup>
import { ref, computed, watch, defineExpose, defineProps } from 'vue';
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import Paging from "@/components/common/PagingView.vue";

const props = defineProps({
  totalItems: Number,
  showView: {
    type: Boolean,
    default: true, // 기본값 true (기존처럼 표시)
  }
});

const perPageOptions = ref([10, 20, 30, 50]);
const selectedPerPage = ref(10);
const currentPage = ref(1); // 항상 첫 번째 페이지가 활성화되도록 초기값 설정

// totalPages가 최소 1이 되도록 보장
const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / selectedPerPage.value)));

// Dropdown에서 값 변경 시 숫자로 변환 + 첫 페이지(`1`)로 이동
watch(selectedPerPage, (newValue) => {
  selectedPerPage.value = Number(newValue); // 숫자로 변환하여 totalPages 정상 계산
  currentPage.value = 1; // 페이지 변경 시 첫 페이지로 이동
});

// 페이지 이동 시 `currentPage` 업데이트 (액티브 상태 반영)
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page; // 현재 페이지 업데이트하여 `active` 클래스 적용
  }
};

defineExpose({
  perPageOptions,
  currentPage,
  selectedPerPage
})

</script>

<template>
  <div class="PagingView">
    <div class="view" v-if="props.showView">
      <p>보기</p>
      <DropdownMenu v-model="selectedPerPage" :options="perPageOptions" mode="pagination" />
      <p>of {{ props.totalItems }}</p>
    </div>
    <Paging :total-pages="totalPages" :current-page="currentPage" @change-page="changePage" />
  </div>
</template>
