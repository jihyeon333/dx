<script setup>
import { computed } from "vue";

// Props 설정
const props = defineProps({
  title: { type: String, default: "" }, // 제목 (선택적)
  width: { type: String, default: "100%" },
  height: { type: String, default: "auto" },
  padding: { type: String, default: "1rem" },
  backgroundColor: { type: String, default: "#ffffff" },
  className: { type: String, default: "" }, // 추가 클래스
});

// 스타일 계산
const cardStyle = computed(() => ({
  width: props.width,
  height: props.height,
  padding: props.padding,
  backgroundColor: props.backgroundColor,
}));
</script>

<template>
  <div :class="['card-box', className]" :style="cardStyle">
    <!-- 타이틀 -->
    <div v-if="title" class="card-header">
      <p>{{ title }}</p>
    </div>

    <!-- 동적 콘텐츠 (slot) -->
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>
