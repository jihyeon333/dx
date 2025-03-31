<script setup>
import { defineProps, defineEmits, computed, watch, onUnmounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes);

const props = defineProps({
    show: Boolean,
    title: String,
    message: String,
    confirmText: { type: String, default: '확인' },
    cancelText: { type: String, default: '취소' },
    overlayClosable: { type: Boolean, default: true },
    showCloseButton: { type: Boolean, default: false },
    align: { type: String, default: 'center' },
    showCancel: { type: Boolean, default: true },
    showButtons: { type: Boolean, default: true },
    showConfirm: { type: Boolean, default: true },
});

const emits = defineEmits(['confirm', 'cancel', 'close']);



const closeModal = () => {
    emits('update:show', false);
    emits('close');
};

const confirmAction = () => {
    emits('confirm');
    closeModal(); // 클릭 시 confirm 후 모달을 닫음
};

const cancelAction = () => {
    emits('cancel');
    closeModal(); // 클릭 시 cancel 후 모달을 닫음
};

// 동적 클래스 생성
const contentClass = computed(() => ({
    'text-left': props.align === 'left',
    'text-center': props.align === 'center',
    'text-right': props.align === 'right',
}));

// 모달 표시 상태 감시
watch(
    () => props.show,
    (val) => {
        if (val) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
);

// 컴포넌트 언마운트 시에도 원복
onUnmounted(() => {
    document.body.style.overflow = '';
});

</script>

<template>
    <div v-if="show" class="modal-overlay" @click.self="overlayClosable ? closeModal() : null">
        <div class="modal-article">
            <div class="modal-header">
                <slot name="header">
                    <h3 v-if="title">{{ title }}</h3>
                </slot>
                <button v-if="showCloseButton" class="close-btn" @click="closeModal">
                    <FontAwesomeIcon :icon="['fas', 'times']" />
                </button>
            </div>

            <div class="modal-content">
                <p v-if="!$slots.default" :class="contentClass">{{ message }}</p>
                <slot></slot>
            </div>

            <div class="modal-buttons" v-if="showButtons">
                <slot name="footer">
                    <button v-if="showCancel" class="modal-button cancel" @click="cancelAction">
                        {{ cancelText }}
                    </button>
                    <button v-if="showConfirm" class="modal-button" @click="confirmAction">
                        {{ confirmText }}
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>
