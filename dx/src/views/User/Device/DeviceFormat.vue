<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Title from '@/components/common/Title.vue';
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import Input from "@/components/common/Input.vue";
import upIcon from "@/assets/image/icon/up_icon.svg";
import downIcon from "@/assets/image/icon/down_icon.svg";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import plusIcon from "@/assets/image/icon/plus_icon.svg";
import deleteIcon from "@/assets/image/icon/delete_icon.svg";
import Modal from "@/components/common/Modal.vue";
import axios from "axios";

import Button from "@/components/common/Button.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";



const router = useRouter();

const selectedCategory = ref("");
const dataValueOptions = ['Short', 'Byte', 'Int', 'Long', 'Char'];
const tabs = ref([
  { name: "입력 포맷", value: "tab1" },
  { name: "출력 포맷", value: "tab2" },
]);
const columns = ref([
  { label: "필드명", key: "fieldName" },
  { label: "필드타입", key: "fieldType" },
  { label: "개수", key: "count" },
  { label: "값 범위(시작)", key: "rangeStart" },
  { label: "값 범위(끝)", key: "rangeEnd" },
  { label: "순서", key: "order" },
]);
const categories = ref([
  { name: "프로토콜", value: "all" },
  { name: "PLC", value: "pcl" },
  { name: "OPC-UA", value: "opcUa" },
  { name: "MQTT", value: "mqtt" },
  { name: "HTPP", value: "htpp" },
  { name: "REST", value: "rest" },
]);

const activeTab = ref(tabs.value[0].value);
const isActive = (tab) => activeTab.value === tab.value;
const inputFormat = ref([]);
const outputFormat = ref([]);

const activeTabFormat = computed(() => activeTab.value === 'tab1' ? inputFormat.value : outputFormat.value);

const initialInputFormat = ref([]);
const initialOutputFormat = ref([]);
const selectedInputRows = ref([]);
const selectedOutputRows = ref([]);
const isSaving = ref(false);


const selectedRows = computed({
  get: () => activeTab.value === 'tab1' ? selectedInputRows.value : selectedOutputRows.value,
  set: val => {
    if (activeTab.value === 'tab1') selectedInputRows.value = val;
    else selectedOutputRows.value = val;
  }
});

const allSelected = computed(() => {
  const currentRows = activeTabFormat.value;
  return currentRows.length > 0 && selectedRows.value.length === currentRows.length;
});

const toggleAll = () => {
  const currentRows = activeTabFormat.value;
  selectedRows.value = allSelected.value ? [] : currentRows.map(row => row.id);
};

let idCounter = 0;
const addNewRow = () => {
  activeTabFormat.value.push({
    id: `row-${idCounter++}`,
    fieldName: '',
    fieldType: '',
    count: '',
    rangeStart: '',
    rangeEnd: '',
  });
};

const deleteSelectedRows = () => {
  activeTabFormat.value = activeTabFormat.value.filter(row => !selectedRows.value.includes(row.id));
  selectedRows.value = [];
};

const moveRow = (id, direction) => {
  const rows = activeTabFormat.value;
  const index = rows.findIndex(r => r.id === id);
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex >= 0 && targetIndex < rows.length) {
    [rows[index], rows[targetIndex]] = [rows[targetIndex], rows[index]];
  }
};

onMounted(() => {
  initialInputFormat.value = JSON.parse(JSON.stringify(inputFormat.value));
  initialOutputFormat.value = JSON.parse(JSON.stringify(outputFormat.value));
});

const haveFieldsChanged = computed(() => {
  const current = activeTabFormat.value;
  const initial = activeTab.value === 'tab1' ? initialInputFormat.value : initialOutputFormat.value;
  return JSON.stringify(current) !== JSON.stringify(initial);
});

const isModalVisible = ref(false);
const modalType = ref("");
const modalMessage = ref("선택한 필드를 삭제하시겠습니까?");
const isCancelModalVisible = ref(false);

const openDeleteConfirmModal = () => {
  if (selectedRows.value.length === 0) return alert("삭제할 항목을 선택하세요.");
  modalType.value = 'delete';
  isModalVisible.value = true;
};

const executeDelete = () => {
  if (modalType.value === 'delete') deleteSelectedRows();
  isModalVisible.value = false;
};

const executeRegistration = () => {
  // 등록 로직 필요시 구현
  isModalVisible.value = false;
};

const closeModal = () => isModalVisible.value = false;
const handleCancelClick = () => haveFieldsChanged.value ? isCancelModalVisible.value = true : goBack();
const goBack = () => router.push("/user/device");

const submitFormat = () => {
  isSaving.value = true;

  setTimeout(() => {
    router.push("/user/device");
  }, 1000);
};


</script>



<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="장비 관리" />
      <section class="top-wrap">
        <div class="tab-container">
          <div class="tabs">
            <button v-for="(tab, index) in tabs" :key="index" type="button" :class="[
              'tab',
              { active: isActive(tab) },
              { 'rounded-left': isActive(tab) && index === 0 },
              { 'rounded-right': isActive(tab) && index === tabs.length - 1 }
            ]" @click="activeTab = tab.value">
              {{ tab.name }}
            </button>
          </div>
          <DropdownMenu v-model="selectedCategory" :options="categories.map(opt => opt.name)" type="radio"
            :arrowIcon="customArrowIcon" placeholder="프로토콜" />
        </div>

        <!-- 버튼 -->
        <div class="right-wrap">
          <button class="btn-add" @click="addNewRow">필드 추가 <img :src="plusIcon"></button>
          <button class="btn-delete" @click="openDeleteConfirmModal">필드 삭제 <img :src="deleteIcon"></button>
        </div>
      </section>

      <section class="add-table-form">
        <div v-if="activeTab === 'tab1'" class="tab-content">
          <div class="table-container add-table fiexd">
            <div class="table-header">
              <table class="table-col">
                <colgroup>
                  <col style="width: 5%;" />
                  <col style="width: 25%;" />
                  <col style="width: 15%;" />
                  <col style="width: 5%;" />
                  <col style="width: 20%;" />
                  <col style="width: 20%;" />
                  <col style="width: 10%;" />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <div class="checkbox-container">
                        <input id="allcheck" type="checkbox" class="checknum" @change="toggleAll"
                          :checked="allSelected" />
                        <label for="allcheck" class="checkmark"></label>
                      </div>
                    </th>
                    <th v-for="col in columns" :key="col.label">{{ col.label }}</th>
                  </tr>
                </thead>
              </table>
            </div>

            <div v-if="activeTabFormat.length === 0" class="non-content">
              <span>내용이 없습니다.</span>
              <button @click="addNewRow">새로 추가</button>
            </div>

            <div class="table-body">
              <table class="table-col">
                <colgroup>
                  <col style="width: 5%;" />
                  <col style="width: 25%;" />
                  <col style="width: 15%;" />
                  <col style="width: 5%;" />
                  <col style="width: 20%;" />
                  <col style="width: 20%;" />
                  <col style="width: 10%;" />
                </colgroup>
                <tbody>
                  <tr v-for="row in activeTabFormat" :key="row.id">
                    <td>
                      <div class="checkbox-container">
                        <input :id="'check-' + row.id" type="checkbox" class="unitcheck checknum" v-model="selectedRows"
                          :value="row.id" />
                        <label :for="'check-' + row.id" class="checkmark"></label>
                      </div>
                    </td>
                    <td><Input v-model="row.fieldName" placeholder="필드명을 입력해주세요" /></td>
                    <td>
                      <DropdownMenu v-model="row.fieldType" :options="dataValueOptions" type="radio"
                        class="select w110" />
                    </td>
                    <td><Input v-model="row.count" placeholder="개수" /></td>
                    <td><Input v-model="row.rangeStart" placeholder="값 시작 범위를 입력해주세요" /></td>
                    <td><Input v-model="row.rangeEnd" placeholder="값 끝 범위를 입력해주세요 " /></td>
                    <td>
                      <div class="button-list">
                        <button class="action-button btn-up" @click="moveRowUp(row.id)"><img :src="upIcon"></button>
                        <button class="action-button btn-down" @click="moveRowDown(row.id)"><img
                            :src="downIcon"></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'tab2'" class="tab-content">
          <div class="table-container add-table fiexd">
            <div class="table-header">
              <table class="table-col">
                <colgroup>
                  <col style="width: 5%;" />
                  <col style="width: 25%;" />
                  <col style="width: 15%;" />
                  <col style="width: 5%;" />
                  <col style="width: 20%;" />
                  <col style="width: 20%;" />
                  <col style="width: 10%;" />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <div class="checkbox-container">
                        <input id="allcheck" type="checkbox" class="checknum" @change="toggleAll"
                          :checked="allSelected" />
                        <label for="allcheck" class="checkmark"></label>
                      </div>
                    </th>
                    <th v-for="col in columns" :key="col.label">{{ col.label }}</th>
                  </tr>
                </thead>
              </table>
            </div>

            <div v-if="activeTabFormat.length === 0" class="non-content">
              <span>내용이 없습니다.</span>
              <button @click="addNewRow">새로 추가</button>
            </div>

            <div class="table-body">
              <table class="table-col">
                <colgroup>
                  <col style="width: 5%;" />
                  <col style="width: 25%;" />
                  <col style="width: 15%;" />
                  <col style="width: 5%;" />
                  <col style="width: 20%;" />
                  <col style="width: 20%;" />
                  <col style="width: 10%;" />
                </colgroup>
                <tbody>
                  <tr v-for="row in activeTabFormat" :key="row.id">
                    <td>
                      <div class="checkbox-container">
                        <input :id="'check-' + row.id" type="checkbox" class="unitcheck checknum" v-model="selectedRows"
                          :value="row.id" />
                        <label :for="'check-' + row.id" class="checkmark"></label>
                      </div>
                    </td>
                    <td><Input v-model="row.fieldName" placeholder="필드명을 입력해주세요" /></td>
                    <td>
                      <DropdownMenu v-model="row.fieldType" :options="dataValueOptions" type="radio"
                        class="select w110" />
                    </td>
                    <td><Input v-model="row.count" placeholder="개수" /></td>
                    <td><Input v-model="row.rangeStart" placeholder="값 시작 범위를 입력해주세요" /></td>
                    <td><Input v-model="row.rangeEnd" placeholder="값 끝 범위를 입력해주세요 " /></td>
                    <td>
                      <div class="button-list">
                        <button class="action-button btn-up" @click="moveRowUp(row.id)"><img :src="upIcon"></button>
                        <button class="action-button btn-down" @click="moveRowDown(row.id)"><img
                            :src="downIcon"></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="button-wrap">
          <div class="buttons right-buttons">
            <Button label="취소" class="cancel-btn" @click="handleCancelClick" />
            <Button label="완료" class="btn-save" @click="submitFormat" />
          </div>
        </div>


      </section>
    </div>
    <Modal v-if="modalType === 'delete'" :show="isModalVisible" title="필드삭제" @update:show="isModalVisible = $event"
      @confirm="executeDelete" @cancel="closeModal" :showCloseButton="true">
      <template #default>
        <p>{{ modalMessage }}</p>
      </template>
    </Modal>
    <Modal v-if="modalType === 'add'" :show="isModalVisible" title="포맷추가" message="포맷을 추가하시겠습니까?"
      @update:show="isModalVisible = $event" @confirm="executeRegistration" @cancel="isModalVisible = false"
      class="confirmModal" />
    <Modal :show="isCancelModalVisible" title="알림" confirmText="확인" cancelText="취소"
      @update:show="isCancelModalVisible = $event" @confirm="goBack" @cancel="isCancelModalVisible = false"
      class="alertModal">
      <template #default>
        <p>작성중인 내용이 있습니다.</p>
        <p>나가시겠습니까?</p>
      </template>
    </Modal>
    <LoadingSpinner v-if="isSaving" />
  </div>
</template>
