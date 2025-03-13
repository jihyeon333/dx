<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import eye from '@/assets/image/icon/Eye.svg';
import eyeClose from '@/assets/image/icon/Eye_Closed.svg';

const props = defineProps({
    modelValue: [String, Number, Boolean], // ✅ modelValue 사용
    placeholder: String,
    type: {
        type: String,
        default: 'text'
    },
    name: String,
    errorMessage: String,
    showCheckButton: Boolean,
    checkButtonLabel: {
        type: String,
        default: "확인"
    },
    isCheckDisabled: Boolean,
    checkboxLabel: String,
    isReadonly: Boolean, // ✅ 읽기 전용 속성
    isDisabled: Boolean // ✅ 비활성화 속성
});

const emits = defineEmits(['update:modelValue', 'validateField', 'checkValue']);

const visible = ref(false);
const isFocused = ref(false);

// errorMessage를 반응형으로 감싸기
const errorText = ref(props.errorMessage || '');

// 부모에서 errorMessage가 변경될 때 감지하여 반영
watch(() => props.errorMessage, (newVal) => {
    errorText.value = newVal || '';
});

// modelValue와 동기화된 computed 속성
const inputValue = computed({
    get: () => props.modelValue || '', // ✅ undefined 방지
    set: (value) => {
        emits('update:modelValue', value || ''); // ✅ undefined 방지
        emits('validateField', props.name, value?.trim() || '');
    }
});

const handleCheckClick = () => {
    emits('checkValue', props.name, inputValue.value.trim());
};
</script>

<template>
    <div class="input-box">
        <div v-if="type === 'checkbox'" class="checkbox-wrapper">
            <input type="checkbox" :id="name" v-model="inputValue" class="checkbox-ipt" />
            <label :for="name" class="checkbox-label">{{ checkboxLabel }}</label>
        </div>

        <div v-else class="input" :class="{ error: !!errorText, focused: isFocused }">
            <input :type="type === 'password' && !visible ? 'password' : 'text'" v-model="inputValue" class="ipt"
                :placeholder="placeholder" @focus="isFocused = true"
                @blur="isFocused = false; emits('validateField', name, inputValue?.trim() || '')" :readonly="isReadonly"
                :disabled="isDisabled" />

            <!-- 비밀번호 토글 버튼 -->
            <div v-if="type === 'password'" class="eye-btn">
                <img :src="visible ? eye : eyeClose" @click="visible = !visible" alt="toggle visibility">
            </div>

            <!-- 확인 버튼 -->
            <button v-if="showCheckButton" class="check-btn" @click="handleCheckClick" :disabled="isCheckDisabled">
                {{ checkButtonLabel }}
            </button>
        </div>
        <p v-show="errorText" class="ipt-error" role="alert">{{ errorText }}</p>
    </div>
</template>
