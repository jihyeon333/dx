<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import Alert from "@/components/common/Alert.vue";
import Modal from "@/components/common/Modal.vue";

const route = useRoute();
const solutionId = ref(route.query.id);

const endpoint = ref("http://ai.solution.com/ID (학습)");

// 기존 데이터를 불러올 함수 (API 호출 대신 Mock Data 사용)
const fetchExistingData = () => {
  alertMessage.value = "데이터 불러오는 중...";
  alertType.value = "info";
  alertVisible.value = true;

  setTimeout(() => {
    const mockData = {
      linkedName: "기존 연계명",
      processType: "압연",
      processName: "구미열압",
      idName: "EXISTING_ID",
      aiType: "예측",
      linkedServer: "http://existing.server.com",
    };

    Object.keys(fields).forEach((key) => {
      fields[key] = mockData[key];
    });

    alertVisible.value = false;
  }, 2000);
};

// 드롭다운 옵션 데이터
const processTypeOptions = ref(["압연", "주조", "도금", "절삭"]);
const processNameOptions = ref(["구미열압", "포항냉압", "광양코팅"]);
const aiTypeOptions = ref(["예측", "분석", "제어"]);

// 필드 정의
const fields = ref({
  linkedName: "",
  processType: "",
  processName: "",
  idName: "",
  aiType: "",
  linkedServer: "",
});

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

const isModalVisible = ref(false);
const modalMessage = ref("연계를 수정하시겠습니까?");
const isServerTestSuccessful = ref(false);

// 서버 연결 테스트
const testServerConnection = () => {
  alertMessage.value = "서버 테스트 중...";
  alertType.value = "info";
  alertVisible.value = true;

  setTimeout(() => {
    alertMessage.value = `서버 테스트 성공: ${fields.value.linkedServer}`;
    alertType.value = "success";
    isServerTestSuccessful.value = true;
    alertVisible.value = true;
  }, 1000);
};

// 버튼 기본 활성화 (true로 고정)
const isFormValid = computed(() => true);

// 🎯 **"수정" 버튼 클릭 시 모달 표시**
const submitUpdate = () => {
  isModalVisible.value = true;
};

// 🎯 **모의 API 요청 (데이터 수정)**
const updateData = () => {
  isModalVisible.value = false;
  alertMessage.value = "수정 중...";
  alertType.value = "info";
  alertVisible.value = true;

  setTimeout(() => {
    alertMessage.value = "연계 정보가 성공적으로 수정되었습니다!";
    alertType.value = "success";
    alertVisible.value = true;
  }, 2000);
};

// 모달 닫기
const closeModal = () => {
  isModalVisible.value = false;
};

// 컴포넌트가 마운트될 때 기존 데이터를 불러옴
onMounted(fetchExistingData);

// 버튼 설정
const rightButtons = [{ label: "완료", type: "primary", action: submitUpdate }];
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="연계 수정" />
      <CardBox>
        <Alert :message="alertMessage" :type="alertType" :visible="alertVisible" @update:visible="alertVisible = false"
          customClass="basicAlert" />

        <div class="content">
          <p>연계 endpoint :</p>
          <Input v-model="endpoint" :is-disabled="true" readonly />
        </div>

        <Form @submit.prevent="submitUpdate" class="edit-form">
          <div class="input-wrap">
            <div class="input-item">
              <p class="tit">연계명</p>
              <Input v-model="fields.linkedName" placeholder="연계명을 입력하세요" :errorMessage="errorMessages.linkedName" />
            </div>

            <div class="input-item">
              <p class="tit">공정종류</p>
              <DropdownMenu v-model="fields.processType" :options="processTypeOptions" placeholder="공정종류 선택" />
            </div>

            <div class="input-item">
              <p class="tit">공정명</p>
              <DropdownMenu v-model="fields.processName" :options="processNameOptions" placeholder="공정명 선택" />
            </div>

            <div class="input-item">
              <p class="tit">ID</p>
              <Input v-model="fields.idName" placeholder="ID를 입력하세요" :errorMessage="errorMessages.idName" />
            </div>

            <div class="input-item">
              <p class="tit">AI 종류</p>
              <DropdownMenu v-model="fields.aiType" :options="aiTypeOptions" placeholder="AI 종류 선택" />
            </div>

            <div class="input-item">
              <p class="tit">서버주소</p>
              <Input v-model="fields.linkedServer" placeholder="서버 주소를 입력해주세요" showCheckButton checkButtonLabel="테스트"
                @checkValue="testServerConnection" />
            </div>
          </div>
        </Form>

        <div class="button-group">
          <div class="left-buttons"></div>
          <div class="right-buttons">
            <Button v-for="(btn, index) in rightButtons" :key="index" :label="btn.label" :type="btn.type"
              @click="btn.action" :disabled="!isFormValid" class="update-btn" />
          </div>
        </div>
      </CardBox>
    </div>

    <Modal :show="isModalVisible" title="연계 수정" :message="modalMessage" @confirm="updateData" @cancel="closeModal" />
  </div>
</template>
