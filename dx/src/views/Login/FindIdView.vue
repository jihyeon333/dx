<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FindIdForm from '@/components/Login/FindIdForm.vue';
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';

const router = useRouter();
const isModalOpen = ref(false);
const modalMessage = ref('');
const isUserFound = ref(false);
const findIdFormRef = ref(null); // FindIdForm을 참조할 변수

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

// 다시 찾기 버튼 클릭 시 폼 초기화
const handleRetry = () => {
  isModalOpen.value = false;
  findIdFormRef.value?.resetForm();
  // 자식 컴포넌트(FindIdForm)의 `resetForm` 함수 실행
};
</script>

<template>
  <div class="login-wrap">
    <div class="find-box">
      <section class="form">
        <!-- `ref="findIdFormRef"`을 추가하여 `FindIdForm`을 참조 -->
        <FindIdForm ref="findIdFormRef" @show-modal="showModal" />
      </section>
    </div>
  </div>

  <!--  모달창 -->
  <Modal :show="isModalOpen" @close="closeModal" class="confirmModal" :overlayClosable="false" :showCloseButton="true"
    :modalData="modalData">
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
