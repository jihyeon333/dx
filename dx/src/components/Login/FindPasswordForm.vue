<script setup>
import { ref, reactive, watch, defineEmits, defineExpose } from 'vue';
import { useRouter } from 'vue-router';
import Form from '@/components/common/Form.vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import { useValidation } from '@/validation/useValidation';

const router = useRouter();
const emits = defineEmits(['show-modal']);

const fields = reactive({
  userId: '',
  userPhone: ''
});

const { errorMessage, validateField } = useValidation(fields);
const disableRegister = ref(true);

//예제 사용자 데이터 (실제 서버 연동 시 API 호출로 대체 가능)
const userDatabase = [
  { phone: '010-1234-5678', userId: 'pomia12345' },
  { phone: '010-9876-5432', userId: 'admin12345' }
];

const resetForm = () => {
  fields.userId = '';
  fields.userPhone = '';
  errorMessage.userId = '';
  errorMessage.userPhone = '';
};

defineExpose({ resetForm });

const handleCancel = () => {
  resetForm();
  router.push({ name: "Login" }); // ✅ 네임드 라우트 사용
};

//아이디 입력 검증
watch(() => fields.userId, (newValue) => {
  errorMessage.userId = newValue.trim() ? '' : '아이디를 입력해주세요.';
});

//전화번호 자동 포맷팅 및 검증
watch(() => fields.userPhone, (newValue) => {
  let cleaned = newValue.replace(/\D/g, ''); // 숫자만 남기기

  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11);
    errorMessage.userPhone = '전화번호는 최대 11자리까지만 입력 가능합니다.';
  } else {
    errorMessage.userPhone = '';
  }

  if (cleaned.length >= 8) {
    cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3, cleaned.length - 4)}-${cleaned.slice(cleaned.length - 4)}`;
  } else if (cleaned.length >= 4) {
    cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  fields.userPhone = cleaned;
  validateField('userPhone', fields.userPhone);
});

//버튼 활성화 여부 감지
watch([() => fields.userId, () => fields.userPhone], () => {
  disableRegister.value =
    !fields.userId.trim() || !fields.userPhone.trim() || !!errorMessage.userPhone || !!errorMessage.userId;
});


const handleFindId = (event) => {
  if (event) event.preventDefault();

  const matchedUser = userDatabase.find(user => user.userId === fields.userId && user.phone === fields.userPhone);

  let modalMessage;
  let isUserFound;

  if (matchedUser) {
    modalMessage = `
      <div class="text">
        <p>비밀번호가 전송완료 되었습니다.</p>
<p>입력하신 메일을 확인해주세요.</p>
      </div>
    `;
    isUserFound = true;
  } else {
    modalMessage = `
      <div class="text">
        <p>해당정보로 조회된 결과가 없습니다.</p>
      </div>
    `;
    isUserFound = false;
  }

  // 부모(`FindIdView.vue`)에 모달을 띄우도록 요청
  emits('show-modal', { message: modalMessage, userFound: isUserFound });
};
</script>

<template>
  <Form title="비밀번호 찾기" class="find-form" buttonPosition="inside">
    <p class="title">
      아이디와 전화번호를 입력하시면 등록된 메일로 <br />
      임시 비밀번호가 발송됩니다.
    </p>
    <div class="input-wrapper">
      <div class="input-wrap">
        <span class="label">아이디</span>
        <Input v-model="fields.userId" placeholder="아이디를 입력해주세요" :errorMessage="errorMessage.userId"
          @blur="validateField('userId', fields.userId)" />
      </div>
      <div class="input-wrap">
        <span class="label">전화번호</span>
        <Input v-model="fields.userPhone" placeholder="010-0000-0000" :errorMessage="errorMessage.userPhone"
          @blur="validateField('userPhone', fields.userPhone)" />
      </div>
    </div>

    <template #buttons>
      <div class="button-wrap">
        <div class="button">
          <Button label="취소" type="button" @click="handleCancel" class="cancle-btn" />
        </div>
        <div class="button">
          <Button label="찾기" type="button" :disabled="disableRegister" @click="handleFindId" class="find-btn" />
        </div>
      </div>
    </template>
  </Form>
</template>
