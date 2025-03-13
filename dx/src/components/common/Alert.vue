<script setup>
import { defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    message: String, // 알림 메시지
    type: {
        type: String,
        default: 'error' // 기본값은 'error'
    },
    visible: Boolean, // 알림 표시 여부
    customClass: String // 추가할 클래스
});

const emits = defineEmits(['update:visible']);

// 1초 후 자동으로 알림 메시지 숨기기
watch(() => props.visible, (newVal) => {
    if (newVal) {
        setTimeout(() => {
            emits('update:visible', false);
        }, 1500);
    }
});
</script>

<template>
    <transition enter-active-class="alert-enter-active" leave-active-class="alert-leave-active" mode="out-in">
        <div v-if="visible" :class="['alert-box', type, customClass]">
            <p>{{ message }}</p>
        </div>
    </transition>
</template>
