<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FindPassWordForm from '@/components/Login/FindPasswordForm.vue';
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';

const router = useRouter();
const isModalOpen = ref(false);
const modalMessage = ref('');
const isUserFound = ref(false);
const findPasswordFormRef = ref(null);

// 자식 컴포넌트에서 `show-modal` 이벤트를 받음
const showModal = ({ message, userFound }) => {
  modalMessage.value = message;
  isUserFound.value = userFound;
  isModalOpen.value = true;
};

// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false;
};

// 로그인 페이지로 이동
const handleGoToLogin = () => {
  isModalOpen.value = false;
  router.push('/LoginView');
};

//  "다시 찾기" 버튼 클릭 시 아이디 입력창에도 에러 메시지 표시
const handleRetry = () => {
  isModalOpen.value = false;
  if (findPasswordFormRef.value) {
    findPasswordFormRef.value.resetForm(); // 입력 필드 초기화
  }
};
</script>

<template>
  <div class="login-wrap">
    <div class="find-box">
      <section class="form">
        <!--  `ref="findPasswordFormRef"`으로 변경 -->
        <FindPassWordForm ref="findPasswordFormRef" @show-modal="showModal" />
      </section>
    </div>
  </div>

  <!--  모달창 -->
  <Modal :show="isModalOpen" @close="closeModal" class="confirmModal" :overlayClosable="false" :showCloseButton="true">
    <template #header>
      <h3>알림</h3>
    </template>

    <div v-html="modalMessage" class="message"></div>

    <template #footer>
      <div class="button-wrap">
        <template v-if="isUserFound">
          <Button label="확인" type="button" @click="closeModal" class="confirm-btn" />
          <Button label="로그인" type="button" @click="handleGoToLogin" class="login-btn" />
        </template>
        <template v-else>
          <Button label="확인" type="button" @click="closeModal" class="confirm-btn" />
          <Button label="다시 찾기" type="button" @click="handleRetry" class="retry-btn" />
        </template>
      </div>
    </template>
  </Modal>
</template>
