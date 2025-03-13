<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import RightIcon from "@/assets/image/icon/right-arrow.svg";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import EditIcon from "@/assets/image/icon/edit.svg";
import Alert from "@/components/common/Alert.vue";
import Modal from "@/components/common/Modal.vue";

const router = useRouter();
const endpoint = ref("http://ai.solution.com/ID (학습)");

const fieldLabels = {
  linkedName: "연계명",
  processType: "공정 종류",
  processName: "공정명",
  idName: "ID",
  aiType: "AI 종류",
  linkedServer: "서버 주소",
};

const fields = {
  linkedName: ref(""),
  processType: ref(""),
  processName: ref(""),
  idName: ref(""),
  aiType: ref(""),
  linkedServer: ref(""),
};

const errorMessages = ref({
  linkedName: "",
  processType: "",
  processName: "",
  idName: "",
  aiType: "",
  linkedServer: "",
});

const alertVisible = ref(false);
const alertMessage = ref("");
const alertType = ref("error");

const processTypeOptions = ["압연", "열처리", "코팅"];
const processNameOptions = ["구미열압", "구미냉압", "포항코팅"];
const aiTypeOptions = ["학습", "예측", "분석"];

// 모달 관련 상태
const isModalVisible = ref(false);
const modalMessage = ref("연계를 추가하시겠습니까?");

// 서버 테스트 성공 여부 추적
const isServerTestSuccessful = ref(false);

// 서버 테스트 진행 여부 (모달 방지)
const isTestingServer = ref(false);

// 필드 검증
const validateField = (key) => {
  if (!fields[key].value.trim()) {
    errorMessages.value[key] = `${fieldLabels[key]}을(를) 입력해주세요.`;
    return false;
  }
  errorMessages.value[key] = "";
  return true;
};

// 서버 연결 테스트
const testServerConnection = () => {
  if (!validateField("linkedServer")) return;

  isTestingServer.value = true; // 서버 테스트 중 상태 설정

  alertMessage.value = `서버 테스트 성공: ${fields.linkedServer.value}`;
  alertType.value = "success";
  alertVisible.value = true;

  isServerTestSuccessful.value = true;

  setTimeout(() => {
    alertVisible.value = false;
    isTestingServer.value = false; // 테스트 완료 후 모달 허용
  }, 3000);
};

// 모든 필드가 입력되고 서버 테스트가 성공해야 폼이 유효하다고 판단
const isFormValid = computed(() => {
  return Object.keys(fields).every((key) => fields[key].value.trim()) && isServerTestSuccessful.value;
});

// 완료 버튼 클릭 시 모달 띄우기
const submitAdd = () => {
  if (isTestingServer.value) return; // 서버 테스트 중에는 모달을 띄우지 않음

  if (!isFormValid.value) {
    alertMessage.value = "모든 필드를 입력하고 서버 테스트를 완료해주세요.";
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }
  isModalVisible.value = true;
};

// 모달 관련 처리
const onConfirmSubmit = () => {
  isModalVisible.value = false;
  // 여기에 실제 연계 추가 로직을 넣으시면 됩니다.
};

const closeModal = () => {
  isModalVisible.value = false;
};

// 버튼 설정
const leftButtons = [
  { label: "파라미터 등록", type: "primary", iconSrc: RightIcon, action: () => router.push("/user/solution/params") },
  { label: "파라미터 수정", type: "secondary", iconSrc: EditIcon, action: () => router.push("/parameter/edit") },
];

const rightButtons = [
  { label: "완료", type: "primary", action: submitAdd }
];
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="연계추가" />
      <CardBox>
        <Alert :message="alertMessage" :type="alertType" :visible="alertVisible" @update:visible="alertVisible = false"
          customClass="basicAlert" />

        <div class="content">
          <p>연계 endpoint :</p>
          <Input v-model="endpoint" :is-disabled="true" readonly />
        </div>

        <Form @submit.prevent="submitAdd" class="add-form">
          <template #default>
            <div class="input-wrap">
              <div class="input-item">
                <p class="tit">연계명</p>
                <Input v-model="fields.linkedName.value" placeholder="연계명을 입력하세요"
                  :errorMessage="errorMessages.linkedName" @blur="validateField('linkedName')" />
              </div>

              <div class="input-item">
                <p class="tit">공정종류</p>
                <DropdownMenu v-model="fields.processType.value" :options="processTypeOptions" placeholder="공정종류 선택"
                  :errorMessage="errorMessages.processType" @blur="validateField('processType')" type="radio"
                  :arrowIcon="customArrowIcon" />
              </div>

              <div class="input-item">
                <p class="tit">공정명</p>
                <DropdownMenu v-model="fields.processName.value" :options="processNameOptions" placeholder="공정명 선택"
                  :errorMessage="errorMessages.processName" @blur="validateField('processName')" type="radio"
                  :arrowIcon="customArrowIcon" />
              </div>

              <div class="input-item">
                <p class="tit">ID</p>
                <Input v-model="fields.idName.value" placeholder="ID를 입력하세요" :errorMessage="errorMessages.idName"
                  @blur="validateField('idName')" />
              </div>

              <div class="input-item">
                <p class="tit">AI 종류</p>
                <DropdownMenu v-model="fields.aiType.value" :options="aiTypeOptions" placeholder="AI 종류 선택"
                  :errorMessage="errorMessages.aiType" @blur="validateField('aiType')" type="radio"
                  :arrowIcon="customArrowIcon" />
              </div>

              <div class="input-item">
                <p class="tit">서버등록<br>(예측)</p>
                <Input v-model="fields.linkedServer.value" placeholder="서버 주소를 입력해주세요" showCheckButton
                  checkButtonLabel="테스트" @checkValue="testServerConnection" :errorMessage="errorMessages.linkedServer"
                  @blur="validateField('linkedServer')" class="widthCheck" />
              </div>
            </div>
          </template>
        </Form>
        <div class="button-group">
          <div class="left-buttons">
            <Button v-for="(btn, index) in leftButtons" :key="index" :label="btn.label" :type="btn.type"
              :iconSrc="btn.iconSrc" @click="btn.action" />
          </div>
          <div class="right-buttons">
            <Button v-for="(btn, index) in rightButtons" :key="index" :label="btn.label" :type="btn.type"
              @click="btn.action" :disabled="!isFormValid" class="add-btn" />
          </div>
        </div>
      </CardBox>
    </div>
    <Modal :show="isModalVisible" :title="'연계추가'" :message="modalMessage" @update:show="isModalVisible = $event"
      @confirm="onConfirmSubmit" @cancel="closeModal" />
  </div>
</template>
