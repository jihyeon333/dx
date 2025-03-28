<script setup>
import { ref, defineEmits, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useValidation } from '@/validation/useValidation';
import Form from '@/components/common/Form.vue';
import Input from '../common/Input.vue';
import Button from '@/components/common/Button.vue';
import RadioCheckbox from "@/components/common/RadioCheckbox.vue";
import Modal from '../common/Modal.vue';


const emits = defineEmits(['closeModal', 'updateUserSuccess']);

const props = defineProps({
    isModal: { type: Boolean, default: false },
    isAdminMode: { type: Boolean, default: false },
    initialFields: { type: Object, default: () => ({}) },
    submitLabel: { type: String, default: "수정" },
    onSubmit: { type: Function, default: null },
    title: {
        type: String,
        default: "회원 정보 수정",
    },
});


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

// 비밀번호 변경 모달 상태
const isPasswordResetModalOpen = ref(false);        // 새 비밀번호 입력
const isPasswordVerifyModalOpen = ref(false);       // 비밀번호 인증
const isNestedModalVisible = ref(false); // 중첩 모달 상태
const modalTitle = ref("");
const modalMessage = ref("");
const modalType = ref("");
const passwordVerifyField = ref('');


// 비밀번호 변경 입력 필드
const passwordFields = ref({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
});

// 비밀번호 변경 버튼 클릭 → 인증 모달 열기
const onClickPasswordReset = () => {
    isPasswordVerifyModalOpen.value = true;
};
// 인증확인
const verifyCurrentPassword = () => {
    if (!passwordVerifyField.value.trim()) {
        modalTitle.value = "입력 오류";
        modalMessage.value = "현재 비밀번호를 입력해주세요.";
        modalType.value = "error";
        isNestedModalVisible.value = true;
        return;
    }

    // 퍼블리싱용: 인증 성공 시 변경 모달 열기
    isPasswordVerifyModalOpen.value = false;
    isPasswordResetModalOpen.value = true;
};

// 비밀번호 변경확인
const confirmPasswordReset = () => {
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
    isPasswordResetModalOpen.value = false;
    isNestedModalVisible.value = true;
};

const closePasswordVerifyModal = () => isPasswordVerifyModalOpen.value = false;
const closePasswordResetModal = () => isPasswordResetModalOpen.value = false;
const closeNestedModal = () => isNestedModalVisible.value = false;



// 회원 정보 수정 제출
const submitForm = () => {
    props.onSubmit?.(fields.value);
    emits("updateUserSuccess", fields.value);
    emits("closeModal"); //
};


</script>

<template>
    <Form :title="title" @submit.prevent="submitForm" class="sign-form" buttonPosition="inside">
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

            <!-- 비밀번호 변경 버튼 -->
            <div class="input-item">
                <div class="title">
                    <p class="tit">비밀번호</p>
                </div>
                <Button label="비밀번호 초기화" type="button" @click="onClickPasswordReset" class="reset-btn" />
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

    <!-- 비밀번호 인증모달 -->
    <Modal :show="isPasswordVerifyModalOpen" title="비밀번호 확인" class="verifyPasswordModal"
        @close="closePasswordVerifyModal">
        <div class="modal-body">
            <p class="modal-desc">
                개인 정보 조회를 위해서는 인증이 필요합니다.<br />
                비밀번호 입력 후 확인 버튼을 클릭해 주세요.
            </p>
            <Input v-model="passwordVerifyField" type="password" placeholder="현재 비밀번호" />
        </div>
        <template #footer>
            <Button label="취소" @click="closePasswordVerifyModal" class="cancel-btn" />
            <Button label="확인" @click="verifyCurrentPassword" class="save-btn" />
        </template>
    </Modal>
    <!-- 비밀번호 변경 모달 -->
    <Modal :show="isPasswordResetModalOpen" title="비밀번호 변경" class="passwordResetModal" @close="closePasswordResetModal">
        <div class="modal-body">
            <Input v-model="passwordFields.newPassword" type="password" placeholder="새 비밀번호" />
            <Input v-model="passwordFields.confirmNewPassword" type="password" placeholder="새 비밀번호 확인" />
        </div>
        <template #footer>
            <Button label="취소" @click="closePasswordResetModal" class="cancel-btn" />
            <Button label="확인" @click="confirmPasswordReset" class="save-btn" />
        </template>
    </Modal>
    <!-- 알림 메시지용 모달 (공통 사용) -->
    <Modal :show="isNestedModalVisible" :title="modalTitle" :message="modalMessage" :modalClass="modalType"
        @close="closeNestedModal" @confirm="closeNestedModal" class="checkModal" :showCancel="false" />
</template>
