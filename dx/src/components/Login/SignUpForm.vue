<script setup>
import { ref, computed, defineEmits, watch } from 'vue';
import { useRouter } from 'vue-router';
import Form from '@/components/common/Form.vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import RadioCheckbox from "@/components/common/RadioCheckbox.vue";
import { useValidation } from '@/validation/useValidation';
import Modal from '../common/Modal.vue';

const props = defineProps({
    isModal: { type: Boolean, default: false },
    isAdminMode: { type: Boolean, default: false },
    initialFields: { type: Object, default: () => ({}) },
    submitLabel: { type: String, default: "등록신청" },
    onSubmit: { type: Function, default: null },

});

const router = useRouter();
const emits = defineEmits(['updateError', 'showModal', 'closeModal', 'signupSuccess']);

const fields = ref({
    userId: props.initialFields.userId || '',
    userPassword: '',
    userPasswordConfirm: '',
    userName: props.initialFields.userName || '',
    userPhone: props.initialFields.userPhone || '',
    userEmail: props.initialFields.userEmail || '',
    companyName: props.initialFields.companyName || '',
    memberTypeSingle: props.initialFields.memberTypeSingle || []
});

const placeholders = {
    userId: "아이디를 입력하세요",
    userPassword: "비밀번호를 입력하세요",
    userPasswordConfirm: "비밀번호를 다시 입력하세요",
    userName: "이름을 입력하세요",
    userPhone: "010-0000-0000",
    userEmail: "example@email.com",
    companyName: "회사명을 입력하세요",
    memberTypeSingle: "회원형태를 선택하세요"
};

const { errorMessage, validateField } = useValidation(fields);

const resetForm = () => {
    Object.keys(fields.value).forEach(key => {
        fields.value[key] = props.initialFields[key] || '';
    });
    isIdChecked.value = false;
    isCheckDisabled.value = false;
};

// 중복 확인 관련 상태값
const isIdChecked = ref(false);
const isCheckDisabled = ref(false);
const selectedCheckboxes = ref([]);
const checkboxOptions = [
    { label: "실증솔루션", value: "solution" },
    { label: "디지털 트윈", value: "digitalTwin" },
    { label: "관리자", value: "admin" },
];
const isModalVisible = ref(false);
const isNestedModalVisible = ref(false); // 중첩 모달 여부
const modalTitle = ref("");
const modalMessage = ref("");
const modalType = ref("");

const fetchUserIdAvailability = async (id) => {
    const existingUsers = ["admin", "testuser", "example123"];
    return !existingUsers.includes(id);
};

const handleCancel = () => {
    resetForm();
    if (props.isModal) {
        emits('closeModal');
    } else {
        router.push({ name: "Login" });
    }
};

// 아이디 변경 시 중복 확인 상태 초기화
watch(() => fields.value.userId, () => {
    isCheckDisabled.value = false;
    isIdChecked.value = false;
});

const checkUserId = async () => {
    console.log("checkUserId() 실행됨"); // 함수 실행 확인

    if (!fields.value.userId.trim()) {
        errorMessage.value.userId = "아이디를 입력해주세요.";
        return;
    }

    errorMessage.value.userId = ""; // 기존 오류 메시지 초기화

    const isAvailable = await fetchUserIdAvailability(fields.value.userId.trim());

    modalTitle.value = "아이디 중복 확인";
    modalMessage.value = isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.";
    modalType.value = isAvailable ? "success" : "error";

    console.log("모달 설정:", modalTitle.value, modalMessage.value, modalType.value); // 값이 제대로 설정되는지 확인

    if (props.isModal) {
        isNestedModalVisible.value = true;
    } else {
        isModalVisible.value = true;
    }

    // 중복 확인 성공 시 버튼 비활성화 유지
    if (isAvailable) {
        isCheckDisabled.value = true;  // 중복 확인 완료 후 비활성화 유지
        isIdChecked.value = true;
        errorMessage.value.userId = "";
    } else {
        isCheckDisabled.value = false; // 중복 확인 실패 시 버튼 활성화
    }
};

// 모달 닫기 핸들러
const closeModal = () => {
    isModalVisible.value = false;
};

const closeNestedModal = () => {
    isNestedModalVisible.value = false;
};


watch(() => fields.value, (newFields) => {
    if (newFields.userPassword !== newFields.userPasswordConfirm) {
        errorMessage.value.userPasswordConfirm = "비밀번호가 일치하지 않습니다.";
    } else {
        errorMessage.value.userPasswordConfirm = "";
    }
}, { deep: true });

// 이메일 유효성 검사
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.value.userEmail = "올바른 이메일 형식을 입력해주세요.";
    } else {
        errorMessage.value.userEmail = "";
    }
};

// 이메일 입력 값 변경 감지
watch(() => fields.value.userEmail, (newEmail) => {
    validateEmail(newEmail);
});

// 전화번호 자동 포맷 적용
watch(() => fields.value.userPhone, (newPhone) => {
    let cleaned = newPhone.replace(/\D/g, '');
    if (cleaned.length > 11) {
        cleaned = cleaned.slice(0, 11);
        errorMessage.value.userPhone = '전화번호는 최대 11자리까지만 입력 가능합니다.';
    } else {
        errorMessage.value.userPhone = '';
    }

    if (cleaned.length >= 8) {
        cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3, cleaned.length - 4)}-${cleaned.slice(cleaned.length - 4)}`;
    } else if (cleaned.length >= 4) {
        cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }

    fields.value.userPhone = cleaned;
    validateField('userPhone', cleaned);
});

// 모든 필드가 입력 완료되었는지 확인
const disableRegister = computed(() => {
    return (
        Object.values(fields.value).some(value => !value.trim()) || // 하나라도 비어 있으면 버튼 비활성화
        Object.values(errorMessage.value).some(msg => msg) || // 에러 메시지가 있으면 비활성화
        !isIdChecked.value // 아이디 중복 확인이 완료되지 않으면 비활성화
    );
});

const submitForm = () => {
    if (disableRegister.value) return;

    if (props.onSubmit) {
        props.onSubmit(fields.value);
    } else {
        emits("signupSuccess"); // 회원가입 성공 이벤트
        emits("closeModal"); // 기존 회원가입 모달 닫기

        if (props.isAdminMode) {
            //관리자 회원 추가 - "회원가입 완료되었습니다." 모달 띄우기
            emits("showModal", {
                title: "회원가입 완료",
                message: "회원가입이 완료되었습니다.",
                type: "success",
                onConfirm: () => {
                    router.push({ path: "/admin/mypage/userlist" }); // 회원 관리 리스트로 이동
                }
            });
        } else {
            //일반 회원가입 - "관리자 승인 후 로그인 가능" 모달 띄우기
            emits("showModal", {
                title: "회원가입 신청 완료",
                message: "관리자의 승인 후 로그인이 가능합니다.",
                type: "info",
                onConfirm: () => {
                    router.push({ path: "/auth/login" }); // 로그인 페이지로 이동
                }
            });
        }
    }
};


</script>

<template>
    <Form :title="isModal ? '회원 추가' : '회원가입'" @submit.prevent="submitForm" class="sign-form" buttonPosition="inside">
        <div class="input-wrap">
            <div class="input-item">
                <div class="title">
                    <p class="tit">아이디</p>
                </div>
                <Input v-model="fields.userId" placeholder="아이디를 입력해주세요" v-model:errorMessage="errorMessage.userId"
                    showCheckButton checkButtonLabel="중복확인" :isCheckDisabled="isCheckDisabled"
                    @checkValue="checkUserId" />
            </div>
            <template v-for="(field, key) in fields" :key="key">
                <div class="input-item" v-if="key !== 'userId'">
                    <div class="title">
                        <p class="tit">
                            {{ key === 'memberTypeSingle' ? '회원형태' :
                                key === 'userPassword' ? '비밀번호' :
                                    key === 'userPasswordConfirm' ? '비밀번호 확인' :
                                        key === 'userName' ? '회원명' :
                                            key === 'userPhone' ? '전화번호' :
                                                key === 'userEmail' ? '이메일' :
                                                    key === 'companyName' ? '회사명' : '' }}
                        </p>
                        <small v-if="key === 'memberTypeSingle'" class="info-text">(복수 선택 가능)</small>
                    </div>
                    <Input v-if="key !== 'memberTypeSingle'" :type="key.includes('Password') ? 'password' : 'text'"
                        showEyeIcon v-model="fields[key]" :placeholder="placeholders[key]"
                        v-model:errorMessage="errorMessage[key]" @blur="validateField(key, fields.value[key])" />
                    <template v-else>
                        <RadioCheckbox v-model="selectedCheckboxes" :options="checkboxOptions" name="memberType"
                            type="checkbox" class="checkboxWrap" />
                    </template>
                </div>
            </template>
        </div>

        <template #buttons>
            <div class="buttons">
                <Button label="취소" type="button" @click="handleCancel" class="cancel-btn" />
                <Button :label="submitLabel" type="submit" :disabled="disableRegister" class="sign-btn" />
            </div>
        </template>
    </Form>

    <Modal :show="isModalVisible" :title="modalTitle" :message="modalMessage" :type="modalType" @close="closeModal"
        class="checkModal" />

    <Modal :show="isNestedModalVisible" :title="modalTitle" :message="modalMessage" :type="modalType"
        @close="closeNestedModal" class="checkModal" />
</template>
