<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import Alert from "@/components/common/Alert.vue";
import Modal from "@/components/common/Modal.vue";
import EditIcon from "@/assets/image/icon/edit.svg";
import RightIcon from "@/assets/image/icon/right-arrow.svg";

const router = useRouter();
const endpoint = ref("http://ai.solution.com/ID (학습)");

const fields = {
  linkedName: ref(""),
  processType: ref(""),
  processName: ref(""),
  idName: ref(""),
  aiType: ref(""),
  linkedServer: ref(""),
};

const alertVisible = ref(false);
const alertMessage = ref("");
const alertType = ref("error");

// 공정 종류별 공정명 매핑
const processMapping = {
  "압연": ["구미열압", "구미냉압"],
  "열처리": ["포항저온", "포항고온"],
  "코팅": ["포항코팅", "구미코팅"]
};

// 공정명별 AI 종류 매핑
const aiMapping = {
  "구미열압": ["학습", "예측"],
  "구미냉압": ["학습"],
  "포항저온": ["분석"],
  "포항고온": ["예측"],
  "포항코팅": ["학습", "예측"],
  "구미코팅": ["분석", "학습"]
};

// 선택 가능한 옵션 (Computed)
const processNameOptions = computed(() => processMapping[fields.processType.value] || []);
const aiTypeOptions = computed(() => aiMapping[fields.processName.value] || []);

// 비활성화 상태 설정
const isProcessNameDisabled = computed(() => !fields.processType.value);
const isAiTypeDisabled = computed(() => !fields.processName.value);

watch(() => fields.processType.value, (newValue) => {
  fields.processName.value = ""; // 공정명 초기화
  fields.aiType.value = ""; // AI 종류 초기화
});


const leftButtons = [
  { label: "파라미터 등록", type: "primary", iconSrc: RightIcon, action: () => router.push("/user/solution/params") },
  { label: "파라미터 수정", type: "secondary", iconSrc: EditIcon, action: () => router.push("/parameter/edit") },
];


// 제출 버튼 핸들러
const submitAdd = () => {
  if (!fields.linkedName.value || !fields.processType.value || !fields.processName.value ||
    !fields.idName.value || !fields.aiType.value || !fields.linkedServer.value) {
    alertMessage.value = "모든 필드를 입력해주세요.";
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }
  isModalVisible.value = true;
};

// 모달 관련 처리
const isModalVisible = ref(false);
const onConfirmSubmit = () => {
  isModalVisible.value = false;
};

const closeModal = () => {
  isModalVisible.value = false;
};


const serverTestAlertMessage = ref(""); // 에러 메시지 (p 태그)
const isTestCompleteModalVisible = ref(false); // 서버 테스트 결과 모달 상태
const testResultMessage = ref(""); // 모달 메시지
const testResultType = ref("success"); // 모달 타입
const isServerTestSuccess = ref(false); // 서버 테스트 성공 여부


const isSubmitDisabled = computed(() => {
  return !(
    fields.linkedName.value &&
    fields.processType.value &&
    fields.processName.value &&
    fields.idName.value &&
    fields.aiType.value &&
    fields.linkedServer.value &&
    isServerTestSuccess.value // 서버 테스트 성공 여부 체크
  );
});


const testServerConnection = async () => {
  // 입력값 검증
  if (!fields.linkedServer.value.trim()) {
    serverTestAlertMessage.value = "서버 주소를 입력해주세요.";
    return;
  }

  // 에러 메시지 초기화
  serverTestAlertMessage.value = "";

  // 모의 서버 테스트 (실제 API 요청 대신 setTimeout 사용)
  setTimeout(() => {
    const isAvailable = fields.linkedServer.value.startsWith("http"); // 간단한 유효성 검사

    if (isAvailable) {
      testResultMessage.value = "서버 연결이 성공했습니다.";
      testResultType.value = "success";
    } else {
      testResultMessage.value = "서버 연결에 실패했습니다.";
      testResultType.value = "error";
    }

    // 결과 모달 열기
    isTestCompleteModalVisible.value = true;
  }, 2000); // 2초 후 테스트 완료
};
// 모달 닫기 핸들러
const confirmTestCompletion = () => {
  if (testResultType.value === "success") {
    isServerTestSuccess.value = true; // 성공했을 경우 상태 변경
  }
  isTestCompleteModalVisible.value = false;
};

// "취소" 버튼 (모달 닫기만 함)
const cancelTestCompletion = () => {
  isTestCompleteModalVisible.value = false;
};
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
                <Input v-model="fields.linkedName.value" placeholder="연계명을 입력하세요" />
              </div>

              <div class="input-item">
                <p class="tit">공정종류</p>
                <DropdownMenu v-model="fields.processType.value" :options="Object.keys(processMapping)"
                  placeholder="공정종류 선택" type="radio" :arrowIcon="customArrowIcon" />
              </div>

              <div class="input-item">
                <p class="tit">공정명</p>
                <DropdownMenu v-model="fields.processName.value" :options="processNameOptions" placeholder="공정명 선택"
                  type="radio" :arrowIcon="customArrowIcon" :isDisabled="isProcessNameDisabled" />
              </div>

              <div class="input-item">
                <p class="tit">AI 종류</p>
                <DropdownMenu v-model="fields.aiType.value" :options="aiTypeOptions" placeholder="AI 종류 선택" type="radio"
                  :arrowIcon="customArrowIcon" :isDisabled="isAiTypeDisabled" />
              </div>

              <div class="input-item">
                <p class="tit">서버등록</p>
                <Input v-model="fields.linkedServer.value" placeholder="서버 주소를 입력하세요" showCheckButton
                  checkButtonLabel="테스트" @checkValue="testServerConnection" />
                <!-- 에러 메시지 (입력값 없을 경우) -->
                <p v-if="serverTestAlertMessage" class="ipt-error" role="alert">
                  {{ serverTestAlertMessage }}
                </p>

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
            <Button label="완료" type="primary" @click="submitAdd" class="add-btn" :disabled="isSubmitDisabled" />
          </div>
        </div>
      </CardBox>
    </div>

    <!-- 서버 테스트 결과 모달 -->
    <Modal :show="isTestCompleteModalVisible" title="서버 테스트 결과" :message="testResultMessage" :type="testResultType"
      :showCancel="testResultType === 'success'" confirmText="확인" cancelText="취소"
      @update:show="isTestCompleteModalVisible = $event" @confirm="confirmTestCompletion" class="confirmModal"
      @cancel="cancelTestCompletion" />



    <!--  연계 추가 확인 모달 -->
    <Modal :show="isModalVisible" title="연계추가" message="연계를 추가하시겠습니까?" @update:show="isModalVisible = $event"
      @confirm="onConfirmSubmit" @cancel="closeModal" class="confirmModal" />
  </div>
</template>