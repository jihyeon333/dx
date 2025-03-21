<script setup>
import { defineProps } from "vue";

defineProps({
    title: String,
    showTitle: { type: Boolean, default: true },
    buttonPosition: { type: String, default: "inside" }, // 버튼 위치 설정
});
</script>

<template>
    <div class="form-wrapper">
        <form class="form-container" @submit.prevent>
            <!--  제목 표시 -->
            <h2 v-if="showTitle && title" class="form-title">{{ title }}</h2>

            <!--  입력 필드 및 콘텐츠 -->
            <div class="form-content">
                <slot />
            </div>

            <!--  내부 버튼 -->
            <div v-if="buttonPosition === 'inside'" class="form-buttons">
                <slot name="buttons" />
            </div>
        </form>

        <!--  외부 버튼 -->
        <div v-if="buttonPosition === 'outside'" class="form-buttons-outside">
            <slot name="buttons" />
        </div>
    </div>
</template>
