<script setup>
import { ref } from 'vue';
import SignUpForm from '@/components/Login/SignUpForm.vue';
import Modal from '@/components/common/Modal.vue';

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalClass = ref('');
const modalConfirmAction = ref(null);

const handleShowModal = ({ title, message, type, onConfirm = null }) => {

    modalTitle.value = title;
    modalMessage.value = message;
    modalClass.value = type === "error" ? "modal-error" : "modal-success";
    modalConfirmAction.value = onConfirm;
    showModal.value = true;
};
// ✅ 모달 확인 버튼 클릭 시 실행
const confirmModalAction = () => {
    if (modalConfirmAction.value) {
        modalConfirmAction.value(); // 로그인 페이지로 이동
    }
    closeModal();
};

// ✅ 모달 닫기
const closeModal = () => {
    modalConfirmAction.value = null;
    showModal.value = false;
};
</script>

<template>
    <div class="login-wrap">
        <p class="sign-title">회원가입 관리자가 승인 후<br>
            계정을 이용하실 수 있습니다.</p>
        <div class="sign-box sign">
            <section class="form">
                <SignUpForm @showModal="handleShowModal" />
            </section>
        </div>
    </div>

    <!-- ✅ 모달 컴포넌트 -->
    <Modal :show="showModal" :title="modalTitle" :message="modalMessage" :modalClass="modalClass"
        @confirm="confirmModalAction" @close="closeModal" class="confirmModal" />
</template>
