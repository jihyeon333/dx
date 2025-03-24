<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import customArrowIcon from "@/assets/image/icon/chevron-down.svg";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import axios from "axios";
import { AI_TYPES } from '@/constants';

onMounted(() => getProcessTypes());

const route = useRoute();

const router = useRouter();

const endpoint = ref("http://ai.solution.com/ID (학습)");

const aiTypes = ref(AI_TYPES);

const fields = ref({
  name: "",
  processType: "",
  processName: "",
  endpoint: "",
  type: "",
  predictionUrl: "",
});

const errorMessages = ref({
  name: "",
  processType: "",
  processName: "",
  endpoint: "",
  type: "",
  predictionUrl: "",
});

const processTypes = ref([]);

const getProcessTypes = async () => {
  const { data } = await axios.get("http://localhost:8204/api/ai/process/type");

  processTypes.value = data;
};

const processNames = ref([]);

const isProcessNameDisabled = ref(true);

const getProcessNames = async (type) => {
  const selectedProcessType = processTypes.value.find(opt => opt.name === type);

  const { data } = await axios.get("http://localhost:8204/api/ai/process/name", {
    params: { typeId: selectedProcessType.id }
  });

  processNames.value = data;
};

watch(() => fields.value.processType, (newValue, oldValue) => {
  if (oldValue) fields.value.processName = "";

  getProcessNames(newValue);

  isProcessNameDisabled.value = false;
});

const alertVisible = ref(false);

const alertMessage = ref("");

const alertType = ref("error");

const isModalVisible = ref(false);

const isAllFieldsFilled = () => {
  return Object.entries(fields.value).every(([key, value]) => !!value);
};

const handleRegisterClick = () => {
  if (!isAllFieldsFilled()) {
    alertMessage.value = "모든 필드를 입력해주세요.";
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }

  isModalVisible.value = true;
};

const executeRegistration = () => {
  const params = {
    ...fields.value,
    type: aiTypes.value.find(o => o.name === fields.value.type).value,
    processId: processNames.value.find(o => o.name === fields.value.processName).id
  };

  axios.post("http://localhost:8204/api/ai/conn", params)
    .then(() => { router.push({ name: "SolutionMain" }) });
};

const isTestCompleteModalVisible = ref(false); // 서버 테스트 결과 모달 상태

const testResultMessage = ref(""); // 모달 메시지

const testResultType = ref("success"); // 모달 타입

const isServerTestSuccess = ref(false); // 서버 테스트 성공 여부

const isCancelModalVisible = ref(false);

const testServerConnection = () => {
  // const urlPattern = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

  // 서버 등록 필드 값 확인
  if (!fields.value.predictionUrl.trim()) {
    errorMessages.value.predictionUrl = "서버 주소를 입력해주세요."; // 에러 메시지 설정
    return;
  }

  // if (!urlPattern.test(fields.value.predictionUrl.trim())) {
  //   errorMessages.value.predictionUrl = "유효한 서버 주소를 입력해주세요."; // 에러 메시지 설정
  //   return;
  // }

  // 성공 처리
  errorMessages.value.predictionUrl = ""; // 에러 메시지 초기화
  testResultMessage.value = "서버 연결이 성공했습니다.";
  testResultType.value = "success";
  isServerTestSuccess.value = true;

  // 성공 모달 띄우기
  isTestCompleteModalVisible.value = true;
};

// "확인" 버튼 클릭 시 에러 메시지 삭제 및 버튼 비활성화
const confirmTestCompletion = () => {
  errorMessages.value.predictionUrl = ""; // 에러 메시지 삭제

  isTestCompleteModalVisible.value = false;
};

const haveFieldsChanged = () => {
  return Object.entries(fields.value).some(([key, value]) => !!value);
};

const handleCancelClick = () => {
  if (!haveFieldsChanged()) {
    goBack();
    return;
  }

  isCancelModalVisible.value = true;
}

const isRegisterButtonDisabled = computed(() => { return !isAllFieldsFilled() || !isServerTestSuccess.value });

const isTestButtonDisabled = computed(() => { return !fields.value.predictionUrl });

const goBack = () => {
  window.history.back();
};
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="연계 추가" />
      <CardBox>
        <Alert :message="alertMessage" :type="alertType" :visible="alertVisible" @update:visible="alertVisible = false"
          customClass="basicAlert" />

        <div class="content">
          <p>연계 endpoint :</p>
          <Input v-model="endpoint" :is-disabled="true" readonly />
        </div>

        <Form @submit.prevent="handleRegisterClick" class="add-form">
          <template #default>
            <div class="input-wrap">
              <div class="input-item">
                <p class="tit">연계명</p>
                <Input v-model="fields.name" placeholder="연계명을 입력하세요" :errorMessage="errorMessages.name" />
              </div>

              <div class="input-item">
                <p class="tit">공정종류</p>
                <DropdownMenu v-model="fields.processType" :options="processTypes.map(opt => opt.name)"
                  placeholder="공정종류 선택" type="radio" :arrowIcon="customArrowIcon" />
              </div>

              <div class="input-item">
                <p class="tit">공정명</p>
                <DropdownMenu v-model="fields.processName" :options="processNames.map(opt => opt.name)"
                  placeholder="공정명 선택" type="radio" :arrowIcon="customArrowIcon" :isDisabled="isProcessNameDisabled" />
              </div>

              <div class="input-item">
                <p class="tit">연계ID</p>
                <Input v-model="fields.endpoint" placeholder="연계ID를 입력하세요" :errorMessage="errorMessages.endpoint" />
              </div>

              <div class="input-item">
                <p class="tit">AI종류</p>
                <DropdownMenu v-model="fields.type" :options="aiTypes.map(opt => opt.name)" placeholder="AI종류 선택"
                  type="radio" :arrowIcon="customArrowIcon" />
              </div>

              <div class="input-item">
                <p class="tit">서버주소</p>
                <Input v-model="fields.predictionUrl" placeholder="서버주소를 입력하세요" showCheckButton checkButtonLabel="테스트"
                  @checkValue="testServerConnection" :errorMessage="errorMessages.predictionUrl"
                  :isCheckDisabled="isTestButtonDisabled" />
              </div>

            </div>
          </template>
        </Form>
        <div class="button-group right">
          <div class="buttons right-buttons">
            <Button label="취소" type="primary" class="cancel-btn" @click="handleCancelClick" />
            <Button label="완료" type="primary" @click="handleRegisterClick" class="add-btn"
              :disabled="isRegisterButtonDisabled" />
          </div>
        </div>
      </CardBox>
    </div>

    <!-- 서버 테스트 결과 모달 -->
    <Modal :show="isTestCompleteModalVisible" title="서버 테스트 결과" :message="testResultMessage" type="success"
      confirmText="확인" @update:show="isTestCompleteModalVisible = $event" @confirm="confirmTestCompletion"
      :showCancel="false" class="confirmModal" />
    <!--  연계 추가 확인 모달 -->
    <Modal :show="isModalVisible" title="연계추가" message="연계를 추가하시겠습니까?" @update:show="isModalVisible = $event"
      @confirm="executeRegistration" @cancel=" isModalVisible = false" class="confirmModal" />

    <!-- 취소 확인 모달  -->
    <Modal :show="isCancelModalVisible" title="알림" confirmText="확인" cancelText="취소"
      @update:show="isCancelModalVisible = $event" @confirm="goBack" @cancel="isCancelModalVisible = false"
      class="alertModal">
      <template #default>
        <p>작성중인 내용이 있습니다.</p>
        <p>나가시겠습니까?</p>
      </template>
    </Modal>
  </div>
</template>