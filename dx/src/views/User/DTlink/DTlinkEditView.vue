<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import Alert from "@/components/common/Alert.vue";
import Modal from "@/components/common/Modal.vue";
import axios from "axios";
import { AI_TYPES } from '@/constants';

onMounted(() => init());

const route = useRoute();

const apiId = ref(route.query.id);

const endpoint = ref("http://ai.solution.com/ID (학습)");

const aiTypes = ref(AI_TYPES);

const fields = ref({});

const alertVisible = ref(false);

const alertMessage = ref("");

const alertType = ref("error");

const errorMessages = ref({
  linkedName: "",
  processType: "",
  processName: "",
  idName: "",
  aiType: "",
});

const init = async () => {
  alertMessage.value = "데이터 불러오는 중...";

  alertType.value = "info";

  alertVisible.value = true;

  await getProcessTypes();

  getApi();
};

const getApi = async () => {
  const { data } = await axios.get(`http://localhost:8204/api/ai/conn/${apiId.value}`);

  fields.value = {
    ...data,
    type: aiTypes.value.find(type => type.value === data.type).name
  };
};

const processTypes = ref([]);

const getProcessTypes = async () => {
  const { data } = await axios.get("http://localhost:8204/api/ai/process/type");

  processTypes.value = data;
};

const processNames = ref([]);

const getProcessNames = async (newSelect) => {
  const selectedProcessType = processTypes.value.find(opt => opt.name === newSelect)

  const { data } = await axios.get("http://localhost:8204/api/ai/process/name", {
    params: {
      typeId: selectedProcessType.id
    }
  });

  processNames.value = data;
};

watch(() => fields.value.processType, (newValue, oldValue) => {
  if (oldValue) fields.value.processName = '';

  getProcessNames(newValue);
});


watch(() => fields.value, (newValue, oldValue) => {
  if (Object.keys(oldValue).length === 0) return;

  haveFieldsChanged.value = true;
}, { deep: true });

const isModalVisible = ref(false);

const modalMessage = ref("연계를 수정하시겠습니까?");

const isCancelModalVisible = ref(false);

const haveFieldsChanged = ref(false);



const isAllFieldsFilled = () => {
  return Object.entries(fields.value).every(([key, value]) => !!value);
};

const handleUpdateClick = () => {
  if (!isAllFieldsFilled()) {
    alertMessage.value = "모든 필드를 입력해주세요.";
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }

  isModalVisible.value = true;
};

const executeUpdate = () => {
  isModalVisible.value = false;

  alertMessage.value = "수정 중...";

  alertType.value = "info";

  alertVisible.value = true;

  const params = {
    ...fields.value,
    type: aiTypes.value.find(opt => opt.name === fields.value.type).value,
    processId: processNames.value.find(opt => opt.name === fields.value.processName).id
  };

  axios.put(`http://localhost:8204/api/ai/conn/${apiId.value}`, params);

  setTimeout(() => {
    alertMessage.value = "연계 정보가 성공적으로 수정되었습니다!";
    alertType.value = "success";
    alertVisible.value = true;
  }, 2000);
};

const handleCancelClick = () => {
  if (!haveFieldsChanged.value) {
    goBack();
    return;
  }

  isCancelModalVisible.value = true;
};

const isUpdateButtonDisabled = computed(() => {
  return !isAllFieldsFilled();
});

const goBack = () => {
  window.history.back();
};
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

        <Form @submit.prevent="handleUpdateClick" class="edit-form">
          <div class="input-wrap">
            <div class="input-item">
              <p class="tit">연계명</p>
              <Input v-model="fields.name" placeholder="연계명을 입력하세요" :errorMessage="errorMessages.linkedName" />
            </div>

            <div class="input-item">
              <p class="tit">공정종류</p>
              <DropdownMenu v-model="fields.processType" :options="processTypes.map(opt => opt.name)" type="radio"
                placeholder="공정종류 선택" />
            </div>

            <div class="input-item">
              <p class="tit">공정명</p>
              <DropdownMenu v-model="fields.processName" :options="processNames.map(opt => opt.name)" type="radio"
                placeholder="공정명 선택" />
            </div>

            <div class="input-item">
              <p class="tit">연계ID</p>
              <Input v-model="fields.endpoint" placeholder="연계ID를 입력하세요" :errorMessage="errorMessages.idName" />
            </div>
          </div>
        </Form>

        <div class="button-group right">
          <div class="buttons right-buttons">
            <Button label="취소" type="primary" class="cancel-btn" @click="handleCancelClick" />
            <Button label="완료" type="primary" @click="handleUpdateClick" class="add-btn"
              :disabled="isUpdateButtonDisabled" />
          </div>
        </div>
      </CardBox>
    </div>

    <Modal :show="isModalVisible" title="연계 수정" :message="modalMessage" @confirm="executeUpdate"
      @cancel="isModalVisible = false" />
    <!-- 취소 확인 모달 -->
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
