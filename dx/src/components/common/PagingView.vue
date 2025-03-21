<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import PrevIcon from '@/assets/image/icon/ico-prev.svg';
import NextIcon from '@/assets/image/icon/ico-next.svg';

const props = defineProps({
  totalPages: Number,
  currentPage: Number,
});

const emit = defineEmits(["change-page"]);

// 페이지 목록 계산 (현재 페이지 기준 최대 5개 표시)
const displayedPages = computed(() => {
  const range = [];
  let start = Math.max(1, props.currentPage - 2); // 현재 페이지 기준 앞 2개
  let end = Math.min(props.totalPages, start + 4); // 5개까지만 표시

  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

// 페이지 변경 함수
const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("change-page", page);
  }
};
</script>

<template>
  <div class="paging">
    <div class="page">
      <!-- 이전 페이지 버튼 -->
      <a href="#" class="pag prev" @click.prevent="changePage(currentPage - 1)"
        :class="{ disabled: currentPage === 1 }">
        <img :src="PrevIcon" alt="이전" class="prev-icon" />
        <span class="skip">이전</span>
      </a>

      <!-- 수정: 숫자 보이도록 변경 -->
      <template v-for="page in displayedPages" :key="page">
        <a href="#" class="pag num" :class="{ current: page === currentPage }" @click.prevent="changePage(page)">
          <span> {{ page }}</span>
        </a>
      </template>

      <!-- 다음 페이지 버튼 -->
      <a href="#" class="pag next" @click.prevent="changePage(currentPage + 1)"
        :class="{ disabled: currentPage === totalPages }">
        <img :src="NextIcon" alt="다음" class="next-icon" />
        <span class="skip">다음</span>
      </a>
    </div>
  </div>
</template>
