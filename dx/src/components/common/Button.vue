<script setup>
import { defineProps, defineEmits } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps({
    label: String, // 버튼 텍스트
    type: { type: String, default: "primary" },
    icon: Object,
    iconSrc: String,
    disabled: Boolean,
});

const emits = defineEmits(["click"]);
</script>

<template>
    <button class="custom-button" :class="type" :disabled="disabled" @click="emits('click')">
        <span>{{ label }}</span>
        <FontAwesomeIcon v-if="icon && !iconSrc" :icon="icon" class="btn-icon" />
        <img v-if="iconSrc" :src="iconSrc" alt="icon" class="btn-icon" />
    </button>
</template>
