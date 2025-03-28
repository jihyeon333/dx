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



const router = useRouter();



const fields = ref({
  deviceName: "",
  protocol: "",
  cycle: "",
});

const errorMessages = ref({
  name: "",
  processType: "",
  processName: "",
  endpoint: "",
  type: "",
  predictionUrl: "",
});



const protocolTypes = ref([
  { name: "PLC", value: "PLC" },
  { name: "OPC-UA", value: "OPC-UA" },
  { name: "MQTT", value: "MQTT" },
  { name: "HTTP", value: "HTTP" },
  { name: "REST", value: "REST" },
]);
const cycleTypes = ref([
  { name: "5", value: "5" },
  { name: "10", value: "10" },
  { name: "15", value: "15" },
  { name: "20", value: "20" },
  { name: "25", value: "25" },
]);


const isCancelModalVisible = ref(false);

const handleCancelClick = () => {
  isCancelModalVisible.value = true;
};

const handleRegisterClick = () => {
  isModalVisible.value = true;
};

const isRegisterButtonDisabled = computed(() => {
  return !fields.value.deviceName || !fields.value.protocol || !fields.value.cycle;
});


const isModalVisible = ref(false);



const executeRegistration = () => {
  console.log("장비 등록 확정!");
  isModalVisible.value = false;

  // 리스트 페이지로 이동
  router.push({
    path: "/user/device/",
    query: { registered: "true" },
  });
};
const goBack = () => {
  router.push("/user/device"); // 리스트 페이지로 이동
};

</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="장비 수정" />
      <CardBox class="noneBorder">
        <Form class="add-form">
          <template #default>
            <div class="input-wrap">
              <div class="input-item">
                <p class="tit">장비명</p>
                <Input v-model="fields.deviceName" placeholder="장비명을 입력하세요" :errorMessage="errorMessages.name" />
              </div>
              <div class="input-item">
                <p class="tit">프로토콜</p>
                <DropdownMenu v-model="fields.protocol" :options="protocolTypes" option-label="name"
                  option-value="value" placeholder="프로토콜" type="radio" :arrowIcon="customArrowIcon" />
              </div>
              <div class="input-item">
                <p class="tit">수집주기</p>
                <DropdownMenu v-model="fields.cycle" :options="cycleTypes" option-label="name" option-value="value"
                  placeholder="수집주기" type="radio" :arrowIcon="customArrowIcon" />
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
    <Modal :show="isModalVisible" title="장비추가" message="장비를 추가하시겠습니까?" @update:show="isModalVisible = $event"
      @confirm="executeRegistration" @cancel="isModalVisible = false" class="confirmModal" />

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