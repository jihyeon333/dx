<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import customArrowIcon from "@/assets/image/icon/chevron-down.svg";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import aiApi from "@/api/aiApi";
import { AI_TYPES } from "@/constants";

onMounted(() => init());

const route = useRoute();

const apiId = ref(route.query.id);

const endpoint = ref("http://ai.solution.com/ID (학습)");

const aiTypes = ref(AI_TYPES);

const fields = ref({});

const init = async () => {
  await getProcessTypes();

  getApi();
};

const getApi = async () => {
  try {
    const { data } = await aiApi.get(`/conn/${apiId.value}`);
  
    const { name, processType, processName, endpoint, type, predictionUrl } = data;
    
    fields.value = {
      name,
      processType,
      processName,
      endpoint,
      predictionUrl,
      type: aiTypes.value.find(o => o.value === type).name
    };
  } catch (e) {
    alert("데이터를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
};

const processTypes = ref([]);

const getProcessTypes = async () => {
  try {
    const { data } = await aiApi.get("/process/type");
  
    processTypes.value = data;
  } catch (error) {
    alert("공정 타입 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
};

const processNames = ref([]);

const getProcessNames = async (newSelect) => {
  try {
    const selectedProcessType = processTypes.value.find(opt => opt.name === newSelect)
  
    const { data } = await aiApi.get("/process/name", {
      params: {
        typeId: selectedProcessType.id
      }
    });
  
    processNames.value = data;
  } catch (error) {
    alert("공정명을 불러오는 데 실패했습니다. 다시 시도해주세요.");
  }
};

watch(() => fields.value.processType, (newValue, oldValue) => {
  if (oldValue) fields.value.processName = '';

  getProcessNames(newValue);
});

watch(() => fields.value.predictionUrl, (newValue, oldValue) => {
  if (!oldValue) return;
  isServerTestSuccess.value = false;
});

const haveFieldsChanged = ref(false);

watch(() => fields.value, (newValue, oldValue) => {
  if (haveFieldsChanged.value || Object.keys(oldValue).length === 0) return;
  
  haveFieldsChanged.value = true;
}, { deep: true });

const isModalVisible = ref(false);

const modalMessage = ref("연계를 수정하시겠습니까?");

const testResultMessage = ref("");

const isServerTestSuccess = ref(true);

const isTestCompleteModalVisible = ref(false);

const testServerConnection = () => {
  testResultMessage.value = "서버 연결이 성공했습니다.";
  
  isServerTestSuccess.value = true;
  
  isTestCompleteModalVisible.value = true;
};

const isAllFieldsFilled = () => {
  return Object.values(fields.value).every(val => !!val);
};

const executeUpdate = async () => {
  try {
    const params = {
      ...fields.value,
      type: aiTypes.value.find(opt => opt.name === fields.value.type).value,
      processId: processNames.value.find(opt => opt.name === fields.value.processName).id
    };
  
    await aiApi.put(`/conn/${apiId.value}`, params);

    window.location.reload();
  } catch (e) {
    alert("업데이트 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

const isCancelModalVisible = ref(false);

const handleCancelClick = () => {
  if (!haveFieldsChanged.value) {
    goBack();
    return;
  }

  isCancelModalVisible.value = true;
};

const isUpdateButtonDisabled = computed(() => !isAllFieldsFilled() || !isServerTestSuccess.value );

const isTestButtonDisabled = computed(() => !fields.value.predictionUrl );

const goBack = () => {
  window.history.back();
};
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="연계 수정" />
      <CardBox>
        <div class="content">
          <p>연계 endpoint :</p>
          <Input v-model="endpoint" :is-disabled="true" readonly />
        </div>

        <Form class="edit-form">
          <div class="input-wrap">
            <div class="input-item">
              <p class="tit">연계명</p>
              <Input v-model="fields.name" placeholder="연계명을 입력하세요" />
            </div>

            <div class="input-item">
              <p class="tit">공정종류</p>
              <DropdownMenu v-model="fields.processType" :options="processTypes.map(opt => opt.name)" type="radio"
                placeholder="공정종류 선택" :arrowIcon="customArrowIcon" />
            </div>

            <div class="input-item">
              <p class="tit">공정명</p>
              <DropdownMenu v-model="fields.processName" :options="processNames.map(opt => opt.name)" type="radio"
                placeholder="공정명 선택" :arrowIcon="customArrowIcon" />
            </div>

            <div class="input-item">
              <p class="tit">연계ID</p>
              <Input v-model="fields.endpoint" placeholder="연계ID를 입력하세요" />
            </div>

            <div class="input-item">
              <p class="tit">AI종류</p>
              <DropdownMenu v-model="fields.type" :options="aiTypes.map(opt => opt.name)" type="radio"
                placeholder="AI 종류 선택" :arrowIcon="customArrowIcon" />
            </div>

            <div class="input-item">
              <p class="tit">서버주소</p>
              <Input v-model="fields.predictionUrl" placeholder="서버주소를 입력해주세요" showCheckButton checkButtonLabel="테스트"
                @checkValue="testServerConnection" :isCheckDisabled="isTestButtonDisabled" />
            </div>
          </div>
        </Form>

        <div class="button-group right">
          <div class="buttons right-buttons">
            <Button label="취소" type="primary" class="cancel-btn" @click="handleCancelClick" />
            <Button label="완료" type="primary" @click="isModalVisible = true;" class="add-btn" :disabled="isUpdateButtonDisabled" />
          </div>
        </div>
      </CardBox>
    </div>

    <Modal :show="isTestCompleteModalVisible" title="서버 테스트 결과" :message="testResultMessage" type="success"
      confirmText="확인" @update:show="isTestCompleteModalVisible = $event" @confirm="isTestCompleteModalVisible = false"
      :showCancel="false" class="confirmModal" />

    <Modal :show="isModalVisible" title="연계 수정" :message="modalMessage" @confirm="executeUpdate" @cancel="isModalVisible = false" />
    
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
