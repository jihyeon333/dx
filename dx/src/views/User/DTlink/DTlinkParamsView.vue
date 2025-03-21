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
import axios from "axios";
import { JSON_TYPES, DIRECTION, IOFORMAT } from '@/constants';
import Button from "@/components/common/Button.vue";

onMounted(() => { getParameters() });

const route = useRoute();

const apiId = ref(route.query.id);

const fields = ref([]);

const getParameters = async () => {
  const { data } = await axios.get(`http://localhost:8204/api/ai/conn/${apiId.value}/parameter`);

  fields.value = data;
};


const tabs = ref(DIRECTION)
const activeTab = ref(tabs.value[0])
const isActive = (tab) => activeTab.value === tab.value;


const activeTabParams = computed(() =>
  fields.value.filter(f => f.direction === activeTab.value.value)
)

const ioFormats = ref(IOFORMAT);

const selectedIoFormat = ref(ioFormats.value[0]);

const selectedRows = ref([]);

const allSelected = computed(() => fields.value.length > 0 && selectedRows.value.length === fields.value.length);

const isIndeterminate = computed(() => selectedRows.value.length > 0 && selectedRows.value.length < fields.value.length);

const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = fields.value.map((row) => row.id);
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
    type: JSON_TYPES[0],
    direction: activeTab.value.value,
    order: len + 1
  });
};

const moveUp = (row) => {
  const index = fields.value.indexOf(row);
  if (index > 0) {
    [fields.value[index], fields.value[index - 1]] = [fields.value[index - 1], fields.value[index]];
    fields.value[index].order = index + 1;
    fields.value[index - 1].order = index;
  }
};

const moveDown = (row) => {
  const index = fields.value.indexOf(row);
  if (index < fields.value.length - 1) {
    [fields.value[index], fields.value[index + 1]] = [fields.value[index + 1], fields.value[index]];
    fields.value[index].order = index + 1;
    fields.value[index + 1].order = index;
  }
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

const executeDelete = () => {
  // DB에 저장된 Row 정보(삭제할 Row에 새로 추가한 Row가 섞여있을 경우를 위한 분류)
  const storedRows = fields.value.filter(item => selectedRows.value.includes(item.id) && !item.id.startsWith("new"));

  // 삭제할 Row를 화면상에서 제거
  fields.value = fields.value.filter(item => !selectedRows.value.includes(item.id));

  // order 재설정
  if (fields.value.length > 0) {
    fields.value = fields.value.map((item, index) => ({
      ...item,
      order: index + 1
    }));
  }

  // 모든 Row를 삭제했을 때와 아닐 때의 API 분류
  if (storedRows.length > 0) {
    if (fields.value.length == 0) {
      axios.delete(`http://localhost:8204/api/ai/conn/${apiId.value}/parameter`);
    } else {
      axios.post(`http://localhost:8204/api/ai/conn/${apiId.value}/parameter`, fields.value);
    }
  }

  closeModal();
}

const executeRegistration = () => {
  axios.post(`http://localhost:8204/api/ai/conn/${apiId.value}/parameter`, fields.value)
    .then(() => { window.location.reload() });
};

const isTableModalVisible = ref(false);

const dbTableData = ref([
  { id: "tb1", name: "TEMP", type: "NUMBER" },
  { id: "tb2", name: "THIN", type: "NUMBER" },
  { id: "tb3", name: "STARTD", type: "STRING" },
  { id: "tb4", name: "TEMP", type: "NUMBER" },
  { id: "tb5", name: "THIN", type: "NUMBER" },
  { id: "tb6", name: "STARTD", type: "STRING" },
  { id: "tb7", name: "TEMP", type: "ARRAY" },
  { id: "tb8", name: "THIN", type: "ARRAY" },
]);

const selectedDbRows = ref([]);

const isDbConfirmDisabled = computed(() => selectedDbRows.value.length === 0);

const addDBColumnToRow = () => {
  const len = activeTabParams.value.length;

  selectedDbRows.value.forEach(row => {
    if (activeTabParams.value.some(o => o.id.includes(row.id))) {
      return;
    }

    fields.value.push({
      id: `new ${row.id}`,
      name: row.name,
      type: row.type,
      direction: activeTab.value.value,
      order: len + 1
    });
  });

  isTableModalVisible.value = false;
};

const isChangedFields = ref(false);

watch(() => fields.value, (newValue, oldValue) => {
  if (oldValue.length === 0) {
    return;
  }

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
            ]" @click="activeTab = tab.value">
              {{ tab.name }}
            </button>
          </div>
          <DropdownMenu v-model="selectedIoFormat" :options="ioFormats" placeholder="입출력 형식" type="radio"
            :arrowIcon="customArrowIcon" />
        </div>
        <div class="right-wrap">
          <button @click="addNewRow" class="btn-add">파라미터 추가 <img :src="plusIcon"></button>
          <button @click="showDeleteModal()" class="btn-delete">파라미터 삭제 <img :src="deleteIcon"></button>
          <button v-if="activeTab.value !== 'RESPONSE'" @click="isTableModalVisible = true"
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
                      <input id="allcheck" type="checkbox" class="checknum" @change="toggleAll" :checked="allSelected"
                        :indeterminate="isIndeterminate" />
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
                <tr v-for="row in activeTabParams" :key="row.id">
                  <td>
                    <div class="checkbox-container">
                      <input :id="'check-' + row.id" type="checkbox" class="unitcheck checknum" v-model="selectedRows"
                        :value="row.id" />
                      <label :for="'check-' + row.id" class="checkmark"></label>
                    </div>
                  </td>
                  <td><Input v-model="row.name" /></td>
                  <td>
                    <DropdownMenu v-model="row.type" :options="JSON_TYPES" type="radio" class="select w110 " />
                  </td>
                  <td>
                    <div class="button-list">
                      <button @click="moveUp(row)" class="action-button btn-up"><img :src="upIcon"></button>
                      <button @click="moveDown(row)" class="action-button btn-down"><img :src="downIcon"></button>
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
            <Button label="완료" @click="executeRegistration" class="btn-save" />
          </div>
        </div>
      </section>
      <Modal :show="isModalVisible" title="삭제 확인" @update:show="isModalVisible = $event" @confirm="executeDelete"
        @cancel="closeModal" :showCloseButton="true">
        <template #default>
          <p>{{ modalMessage }}</p>
        </template>
      </Modal>

    </div>
    <Modal :show="isTableModalVisible" title="DB 테이블" @update:show="isTableModalVisible = $event" class="tableModal"
      :overlayClosable="false" :showCloseButton="true" @close="isTableModalVisible = false">
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
        <button class="modal-button" @click="addDBColumnToRow" :disabled="isDbConfirmDisabled">완료</button>
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
