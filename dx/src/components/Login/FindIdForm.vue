<script setup>
import { ref, reactive, watch, defineEmits, defineExpose } from 'vue';
import { useRouter } from 'vue-router';
import Form from '@/components/common/Form.vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import { useValidation } from '@/validation/useValidation';

const router = useRouter();
const emits = defineEmits(['show-modal']);

// 상태 관리
const fields = reactive({
  userPhone: '',
});

const { errorMessage, validateField } = useValidation(fields);

const disableRegister = ref(true);

//예제 데이터 (실제 서버 연동 시 API 호출로 변경 가능)
const userDatabase = [
  { phone: '010-1234-5678', userId: 'pomia12345' },
  { phone: '010-9876-5432', userId: 'admin12345' }
];

// 부모에서 호출 가능하도록 `resetForm`을 `defineExpose`로 노출
const resetForm = () => {
  Object.keys(fields).forEach(key => {
    fields[key] = '';
  });
  errorMessage.userPhone = '';
};
defineExpose({ resetForm }); // 부모 컴포넌트에서 `resetForm`을 직접 호출 가능하도록 설정

const handleCancel = () => {
  resetForm();
  router.push({ name: "Login" }); // ✅ 네임드 라우트 사용
};
// 전화번호 자동 포맷팅 및 검증
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

  disableRegister.value = !fields.userPhone || !!errorMessage.userPhone;
});

// 아이디 찾기 실행 → 부모(`FindIdView.vue`)로 데이터 전달
const handleFindId = (event) => {
  if (event) event.preventDefault();

  const matchedUser = userDatabase.find(user => user.phone === fields.userPhone);
  let modalMessage;
  let isUserFound;

  if (matchedUser) {
    modalMessage = `
      <div class="text">
        <p>아이디 찾기가 완료되었습니다.</p>
        <p>검색 결과는 아래와 같습니다.</p>
      </div>
      <div class="box space">
        <p>아이디</p> <p>${matchedUser.userId}</p>
      </div>
    `;
    isUserFound = true;
  } else {
    modalMessage = `
      <div class="text">
        <p>아이디 찾기가 완료되었습니다.</p>
        <p>검색 결과는 없습니다.</p>
      </div>
    `;
    isUserFound = false;
  }

  // 부모(`FindIdView.vue`)에 모달을 띄우도록 요청
  emits('show-modal', { message: modalMessage, userFound: isUserFound });
};
</script>


<template>
  <Form title="아이디찾기" buttonPosition="inside" class="find-form">
    <div class="input-wrapper">
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
