<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Title from '@/components/common/Title.vue';
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import Input from "@/components/common/Input.vue";
import upIcon from "@/assets/image/icon/up_icon.svg";
import downIcon from "@/assets/image/icon/down_icon.svg";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import plusIcon from "@/assets/image/icon/plus_icon.svg";
import deleteIcon from "@/assets/image/icon/delete_icon.svg";
import Modal from "@/components/common/Modal.vue";
import aiApi from "@/api/aiApi";
import { JSON_TYPES, DIRECTION, IOFORMATS } from "@/constants";
import Button from "@/components/common/Button.vue";

onMounted(() => { getParameters() });

const route = useRoute();

const apiId = ref(route.query.id);

const fields = ref([]);

const getParameters = async () => {
  try {
    const { data } = await aiApi.get(`/conn/${apiId.value}/parameter`);
  
    fields.value = data.map(({ apiId, ...rest }) => ({
      ...rest,
      isDisabled: rest.name === FIELD_LIST_NAME,
    }));
  
    const fieldListJson = fields.value.find(o => o.name === FIELD_LIST_NAME)?.dataFieldName;
  
    selectedDbRows.value = fieldListJson ? JSON.parse(fieldListJson) : [];
  } catch (e) {
    alert("데이터를 불러오는 데 실패했습니다.");
  }
};

const jsonTypes = ref(JSON_TYPES);

const tabs = ref(DIRECTION);

const activeTab = ref(tabs.value[0]);

const isActive = (tab) => activeTab.value?.value === tab.value;

const handleTabClick = (tab) => {
  if (!isActive(tab)) {
    selectedRows.value = [];
  }

  activeTab.value = tab;
};

const activeTabParams = computed(() =>
  fields.value.filter(f => f.direction === activeTab.value.value)
);

const ioFormats = ref(IOFORMATS);

const selectedIoFormat = ref(ioFormats.value[0]);

const selectedRows = ref([]);

const allSelected = computed(() => {
  const idsInTab = activeTabParams.value.map(r => r.id);
  return idsInTab.length > 0 && idsInTab.every(id => selectedRows.value.includes(id));
});

const FIELD_LIST_NAME = "FIELD_LIST";

const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = activeTabParams.value.map((row) => row.id);
  }
};

const columns = ref([
  { label: "속성명" },
  { label: "값형식" },
  { label: "순서" },
]);

const addNewRow = () => {
  const len = activeTabParams.value.length;

  fields.value.push({
    id: `new ${activeTab.value.value.toLowerCase()}${len + 1}`,
    name: `${activeTab.value.name}${len + 1}`,
    type: jsonTypes.value[0],
    direction: activeTab.value.value,
    order: len + 1,
    dataFieldName: null,
    isDisabled: false
  });
};

const moveUp = (row) => {
  const idx = fields.value.findIndex(r => r.id === row.id);

  [fields.value[idx], fields.value[idx - 1]] = [fields.value[idx - 1], fields.value[idx]];

  reorder();
};

const moveDown = (row) => {
  const idx = fields.value.findIndex(r => r.id === row.id);

  [fields.value[idx], fields.value[idx + 1]] = [fields.value[idx + 1], fields.value[idx]];

  reorder();
};

const reorder = () => {
  fields.value.forEach((item, idx) => {
    item.order = idx + 1;
  });
};

const isModalVisible = ref(false);

const modalMessage = ref("");

const showDeleteModal = () => {
  const len = selectedRows.value.length;

  if (len === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }

  modalMessage.value = `${len}개의 항목을 삭제하시겠습니까?`;

  isModalVisible.value = true;
}

const isCancelModalVisible = ref(false);

const handleCancelClick = () => {
  if (!isChangedFields.value) {
    goBack();
    return;
  }

  isCancelModalVisible.value = true;
};

const executeDelete = async () => {
  try {
    // 실제 저장된 row 중 삭제 대상 필터링
    const storedRows = fields.value.filter(
      item => selectedRows.value.includes(item.id) && !item.id.startsWith("new")
    );

    // FIELD_LIST 삭제 시 selectedDbRows 초기화
    const isDeletingFieldList = selectedRows.value.some(
      id => {
        const item = fields.value.find(row => row.id === id);
        return item?.name === FIELD_LIST_NAME;
      }
    );

    if (isDeletingFieldList) {
      selectedDbRows.value = [];
    }

    // 선택된 항목 삭제
    const remainingFields = fields.value.filter(item => !selectedRows.value.includes(item.id));

    // 서버 업데이트
    if (storedRows.length > 0) {
      const url = `/conn/${apiId.value}/parameter`;
      
      if (fields.value.length === 0) {
        await aiApi.delete(url);
      } else {
        await aiApi.post(url, remainingFields);
      }
    }
    
    // 상태 반영
    fields.value = remainingFields;
  
    selectedRows.value = [];
  } catch (e) {
    alert("삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
  } finally {
    closeModal();
  }
}

const handleRegisterClick = () => {
  const nameCounts = fields.value.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  const hasDuplicate = Object.values(nameCounts).some(count => count > 1);

  if (hasDuplicate) {
    alert("중복된 속성명이 있습니다.");
    return;
  }

  executeRegistration();
};

const executeRegistration = async () => {
  try {
    const dataFieldList = fields.value.find(o => o.name === FIELD_LIST_NAME);
  
    if (dataFieldList) {
      dataFieldList.dataFieldName = JSON.stringify(selectedDbRows.value);
    }
  
    await aiApi.post(`/conn/${apiId.value}/parameter`, fields.value);

    window.location.reload();
  } catch (error) {
    alert('등록에 실패했습니다. 다시 시도해주세요.');
  }
};

const isTableModalVisible = ref(false);

const dbTableData = ref([
  { id: "tb1", name: "TEMPERATURE", type: "NUMBER" },
  { id: "tb2", name: "HUMIDITY", type: "NUMBER" },
  { id: "tb3", name: "THIN", type: "VIDEO" },
  { id: "tb4", name: "STARTED", type: "DATETIME" },
]);

const selectedDbRows = ref([]);

const addDBColumnToFieldList = () => {
  const len = activeTabParams.value.length;

  if (!activeTabParams.value.some(o => o.name ===FIELD_LIST_NAME)) {
    fields.value.push({
      id: "new field list",
      name: FIELD_LIST_NAME,
      type: jsonTypes.value[2],
      direction: activeTab.value.value,
      order: len + 1,
      dataFieldName: null,
      isDisabled: true
    });
  }

  isTableModalVisible.value = false;
};

const isChangedFields = ref(false);

watch(() => fields.value, (newValue, oldValue) => {
  if (oldValue.length === 0) return;

  isChangedFields.value = true;
}, { deep: true });

const closeModal = () => {
  isModalVisible.value = false;
};

const goBack = () => {
  window.history.back();
};
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="파라미터 목록" />
      <section class="top-wrap">
        <div class="tab-container">
          <div class="tabs">
            <button v-for="(tab, index) in tabs" :key="index" type="button" :class="[
              'tab',
              { active: isActive(tab) },
              { 'rounded-left': isActive(tab) && index === 0 },
              { 'rounded-right': isActive(tab) && index === tabs.length - 1 }
            ]" @click="handleTabClick(tab)">
              {{ tab.name }}
            </button>
          </div>
          <DropdownMenu v-model="selectedIoFormat" :options="ioFormats" placeholder="입출력 형식" type="radio"
            :arrowIcon="customArrowIcon" />
        </div>
        <div class="right-wrap">
          <button @click="addNewRow" class="btn-add">파라미터 추가 <img :src="plusIcon"></button>
          <button @click="showDeleteModal()" class="btn-delete">파라미터 삭제 <img :src="deleteIcon"></button>
          <button v-if="activeTab.value === tabs[0].value" @click="isTableModalVisible = true"
            class="btn-table">테이블보기</button>
        </div>
      </section>

      <section class="add-table-form">
        <div class="table-container add-table fiexd">
          <div class="table-header">
            <table class="table-col">
              <colgroup>
                <col style="width: 10%;" />
                <col style="width: 30%;" />
                <col style="width: 30%;" />
                <col style="width: 30%;" />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <div class="checkbox-container">
                      <input id="allcheck" type="checkbox" class="checknum" @change="toggleAll" :checked="allSelected" />
                      <label for="allcheck" class="checkmark"></label>
                    </div>
                  </th>
                  <th v-for="col in columns" :key="col.label">{{ col.label }}</th>
                </tr>
              </thead>
            </table>
          </div>

          <div v-if="activeTabParams.length === 0" class="non-content">
            <span>내용이 없습니다.</span>
            <button @click="addNewRow">새로 추가</button>
          </div>

          <div class="table-body">
            <table class="table-col">
              <colgroup>
                <col style="width: 10%;" />
                <col style="width: 30%;" />
                <col style="width: 30%;" />
                <col style="width: 30%;" />
              </colgroup>
              <tbody>
                <tr v-for="(row, idx) in activeTabParams" :key="row.id">
                  <td>
                    <div class="checkbox-container">
                      <input :id="'check-' + row.id" type="checkbox" class="unitcheck checknum" v-model="selectedRows"
                        :value="row.id" />
                      <label :for="'check-' + row.id" class="checkmark"></label>
                    </div>
                  </td>
                  <td><Input v-model="row.name" :isDisabled="row.isDisabled" /></td>
                  <td>
                    <DropdownMenu v-model="row.type" :options="jsonTypes" type="radio" class="select w110" :isDisabled="row.isDisabled" />
                  </td>
                  <td>
                    <div class="button-list">
                      <button @click="moveUp(row)" class="action-button btn-up" :disabled="idx === 0"><img :src="upIcon"></button>
                      <button @click="moveDown(row)" class="action-button btn-down" :disabled="idx + 1 === activeTabParams.length"><img :src="downIcon"></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="button-wrap">
          <div class="buttons right-buttons">
            <Button label="취소" class=" cancel-btn" @click="handleCancelClick" />
            <Button label="완료" @click="handleRegisterClick" class="btn-save" />
          </div>
        </div>
      </section>
      <Modal :show="isModalVisible" title="삭제 확인" @update:show="isModalVisible = $event" @confirm="executeDelete"
        @cancel="closeModal">
        <template #default>
          <p>{{ modalMessage }}</p>
        </template>
      </Modal>

    </div>
    <Modal :show="isTableModalVisible" title="DB 테이블" @update:show="isTableModalVisible = $event" class="tableModal"
      :overlayClosable="false">
      <template #default>
        <div class="modal-table-container">
          <table class="modal-table">
            <colgroup>
              <col style="width: auto" />
              <col style="width: auto" />
              <col style="width: auto" />
            </colgroup>
            <thead>
              <tr>
                <th>필드명</th>
                <th>타입</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dbTableData" :key="row.id">
                <td>{{ row.name }}</td>
                <td>{{ row.type }}</td>
                <td>
                  <div class="checkbox-container">
                    <input :id="'db-check-' + row.id" type="checkbox" class="unitcheck checknum"
                      v-model="selectedDbRows" :value="row" />
                    <label :for="'db-check-' + row.id" class="checkmark"></label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #footer>
        <button class="modal-button" @click="addDBColumnToFieldList">완료</button>
      </template>
    </Modal>
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