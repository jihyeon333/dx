<script setup>
import { ref, defineEmits, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useValidation } from '@/validation/useValidation';
import Form from '@/components/common/Form.vue';
import Input from '../common/Input.vue';
import Button from '@/components/common/Button.vue';
import RadioCheckbox from "@/components/common/RadioCheckbox.vue";
import Modal from '../common/Modal.vue';

const props = defineProps({
    isModal: { type: Boolean, default: false },
    isAdminMode: { type: Boolean, default: false },
    initialFields: { type: Object, default: () => ({}) },
    submitLabel: { type: String, default: "수정" },
    onSubmit: { type: Function, default: null },
});

const emits = defineEmits(['closeModal', 'updateUserSuccess']);
const router = useRouter();
const selectedCategory = ref("연계명");
const fields = ref({
    userId: 'testUser01',
    userName: '홍길동',
    userPhone: '',
    userEmail: '',
    companyName: '',
    memberTypeSingle: [],
});



watch(() => props.initialFields, (newFields) => {
    if (newFields && Object.keys(newFields).length > 0) {
        fields.value = { ...newFields };
    }
}, { immediate: true, deep: true });

const { errorMessage, validateField } = useValidation(fields);

// ✅ 비밀번호 변경 모달 상태
const isPasswordResetModalOpen = ref(false);
const isNestedModalVisible = ref(false); // 중첩 모달 상태
const modalTitle = ref("");
const modalMessage = ref("");
const modalType = ref("");

// ✅ 비밀번호 변경 입력 필드
const passwordFields = ref({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
});

// ✅ 비밀번호 변경 모달 열기
const openPasswordResetModal = () => {
    isPasswordResetModalOpen.value = true;
};

// ✅ 비밀번호 변경 확인 모달 열기
const confirmPasswordReset = () => {
    if (!passwordFields.value.currentPassword.trim()) {
        modalTitle.value = "입력 오류";
        modalMessage.value = "현재 비밀번호를 입력해주세요.";
        modalType.value = "error";
        isNestedModalVisible.value = true;
        return;
    }
    if (!passwordFields.value.newPassword.trim()) {
        modalTitle.value = "입력 오류";
        modalMessage.value = "새 비밀번호를 입력해주세요.";
        modalType.value = "error";
        isNestedModalVisible.value = true;
        return;
    }
    if (passwordFields.value.newPassword !== passwordFields.value.confirmNewPassword) {
        modalTitle.value = "비밀번호 불일치";
        modalMessage.value = "새 비밀번호가 일치하지 않습니다.";
        modalType.value = "error";
        isNestedModalVisible.value = true;
        return;
    }

    modalTitle.value = "비밀번호 변경 완료";
    modalMessage.value = "비밀번호가 성공적으로 변경되었습니다.";
    modalType.value = "success";
    isNestedModalVisible.value = true;
};

// ✅ 모달 닫기
const closePasswordResetModal = () => {
    isPasswordResetModalOpen.value = false;
};

// ✅ 중첩 모달 닫기
const closeNestedModal = () => {
    isNestedModalVisible.value = false;
};

// ✅ 회원 정보 수정 제출
const submitForm = () => {
    props.onSubmit?.(fields.value);
    emits("updateUserSuccess", fields.value);
    emits("closeModal");
};
</script>

<template>
    <Form title="회원 정보 수정" @submit.prevent="submitForm" class="sign-form" buttonPosition="inside">
        <div class="input-wrap">
            <!-- 아이디 (수정 불가) -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">아이디</p>
                </div>
                <Input v-model="fields.userId" :isDisabled="true" />
            </div>

            <!-- 이름 (수정 불가) -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">회원명</p>
                </div>
                <Input v-model="fields.userName" :isDisabled="true" />
            </div>

            <!-- ✅ 비밀번호 변경 버튼 -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">비밀번호</p>
                </div>
                <Button label="비밀번호 초기화" type="button" @click="openPasswordResetModal" class="reset-btn" />
            </div>

            <!-- 전화번호 -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">전화번호</p>
                </div>
                <Input v-model="fields.userPhone" v-model:errorMessage="errorMessage.userPhone"
                    @blur="validateField('userPhone', fields.userPhone)" />
            </div>

            <!-- 이메일 -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">이메일</p>
                </div>
                <Input v-model="fields.userEmail" v-model:errorMessage="errorMessage.userEmail"
                    @blur="validateField('userEmail', fields.userEmail)" />
            </div>

            <!-- 회사명 -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">회사명</p>
                </div>
                <Input v-model="fields.companyName" />
            </div>

            <!-- 회원형태 체크박스 -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">회원형태</p>
                    <small class="info-text">(복수 선택 가능)</small>
                </div>
                <RadioCheckbox v-model="fields.memberTypeSingle" :options="[
                    { label: '실증솔루션', value: 'solution' },
                    { label: '디지털 트윈', value: 'digitalTwin' },
                    { label: '관리자', value: 'admin' }
                ]" name="memberType" type="checkbox" class="checkboxWrap" />
            </div>
        </div>

        <template #buttons>
            <div class="buttons">
                <Button label="취소" type="button" @click="emits('closeModal')" class="cancel-btn" />
                <Button :label="submitLabel" type="submit" class="save-btn" />
            </div>
        </template>
    </Form>

    <!-- ✅ 비밀번호 변경 모달 -->
    <Modal :show="isPasswordResetModalOpen" title="비밀번호 변경" class="passwordResetModal" @close="closePasswordResetModal">
        <div class="modal-body">
            <Input v-model="passwordFields.currentPassword" type="password" placeholder="현재 비밀번호" />
            <Input v-model="passwordFields.newPassword" type="password" placeholder="새 비밀번호" />
            <Input v-model="passwordFields.confirmNewPassword" type="password" placeholder="새 비밀번호 확인" />
        </div>
        <template #footer>
            <Button label="취소" @click="closePasswordResetModal" class="cancel-btn" />
            <Button label="확인" @click="confirmPasswordReset" class="save-btn" />
        </template>
    </Modal>

    <!-- ✅ 중첩 모달 -->
    <Modal :show="isNestedModalVisible" :title="modalTitle" :message="modalMessage" :modalClass="modalType"
        @close="closeNestedModal" class="checkModal" />
</template>
