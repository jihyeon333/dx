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

</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="장비추가" />
      <CardBox class="card">

        <Form class="add-form">
          <template #default>
            <div class="input-wrap">
              <div class="input-item">
                <p class="tit">장비명</p>
                <Input v-model="fields.name" placeholder="장비명을 입력하세요" :errorMessage="errorMessages.name" />
              </div>
              <div class="input-item">
                <p class="tit">프로토콜</p>
                <DropdownMenu v-model="fields.protocolTypes" :options="protocolTypes" option-label="name"
                  option-value="value" placeholder="프로토콜" type="radio" :arrowIcon="customArrowIcon" />
              </div>
              <div class="input-item">
                <p class="tit">수집주기</p>
                <DropdownMenu v-model="fields.cycleTypes" :options="cycleTypes" option-label="name" option-value="value"
                  placeholder="수집주기" type="radio" :arrowIcon="customArrowIcon" />
              </div>

            </div>
          </template>
        </Form>
      </CardBox>
    </div>

  </div>
</template>