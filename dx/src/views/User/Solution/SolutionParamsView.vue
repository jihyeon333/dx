<script setup>
import { ref, computed, watch } from "vue";
import Title from '@/components/common/Title.vue';
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import Input from "@/components/common/Input.vue";
import upIcon from "@/assets/image/icon/up_icon.svg";
import downIcon from "@/assets/image/icon/down_icon.svg";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import plusIcon from "@/assets/image/icon/plus_icon.svg";
import deleteIcon from "@/assets/image/icon/delete_icon.svg";
import Modal from "@/components/common/Modal.vue";

// 탭 상태 관리
const tabs = ['요청 파라미터', '응답 파라미터'];
const activeTab = ref(localStorage.getItem("activeTab") || tabs[0]);
watch(activeTab, (newTab) => {
  if (!tabs.includes(newTab)) {
    activeTab.value = tabs[0]; // 강제로 첫 번째 탭으로 설정
  } else {
    localStorage.setItem("activeTab", newTab); // 유효하면 저장
  }
});

// 선택된 옵션 (입출력 형식)
const selectedOption = ref("");
const selectedOptions = ["JSON", "TEXT"];

// 값형식 옵션
const dataValueOptions = ["String", "Number", "Array"];

// 테이블 데이터
const data = ref([
  { id: 1, name: "API_KEY", dataValue: "String", order: 1 },
  { id: 2, name: "ID", dataValue: "Number", order: 2 },
]);

// 데이터가 비었는지 확인
const isEmpty = computed(() => data.value.length === 0);

// 선택된 행
const selectedRows = ref([]);

// 전체 선택 여부
const allSelected = computed(() => data.value.length > 0 && selectedRows.value.length === data.value.length);
const isIndeterminate = computed(() => selectedRows.value.length > 0 && selectedRows.value.length < data.value.length);

// 개별 체크박스 선택 핸들러
const toggleSelection = (id) => {
  if (!id) return;
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter((rowId) => rowId !== id);
  } else {
    selectedRows.value.push(id);
  }
};

// 전체 선택 / 해제 핸들러
const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = data.value.map((row) => row.id);
  }
};

// 탭 변경 시 로컬 스토리지에 저장
watch(activeTab, (newTab) => {
  localStorage.setItem("activeTab", newTab);
});

// 컬럼 정의
const columns = ref([
  { label: "속성명", width: "20%" },
  { label: "값형식", width: "20%" },
  { label: "삭제/적용", width: "20%" },
  { label: "순서", width: "20%" },
]);

// 순서 변경 핸들러
const moveUp = (row) => {
  const index = data.value.indexOf(row);
  if (index > 0) {
    [data.value[index], data.value[index - 1]] = [data.value[index - 1], data.value[index]];
    data.value[index].order = index + 1;
    data.value[index - 1].order = index;
  }
};

const moveDown = (row) => {
  const index = data.value.indexOf(row);
  if (index < data.value.length - 1) {
    [data.value[index], data.value[index + 1]] = [data.value[index + 1], data.value[index]];
    data.value[index].order = index + 1;
    data.value[index + 1].order = index;
  }
};

// 삭제 함수
const deleteRow = (row) => {
  data.value = data.value.filter(item => item.id !== row.id);
};

// 삭제 확인 모달 상태 관리
const isModalVisible = ref(false);
const modalMessage = ref("");
const rowToDelete = ref(null);
const isBulkDelete = ref(false); // 여러 개 삭제 여부


// 삭제 확인 모달 표시 함수
const showDeleteModal = (row = null) => {
  if (row) {
    // 개별 삭제
    isBulkDelete.value = false;
    rowToDelete.value = row;
    modalMessage.value = `선택한 항목(${row.name})을 삭제하시겠습니까?`;
    isModalVisible.value = true;
  } else if (selectedRows.value.length > 0) {
    // 여러 개 삭제
    isBulkDelete.value = true;
    modalMessage.value = `선택된 ${selectedRows.value.length}개의 항목을 삭제하시겠습니까?`;
    isModalVisible.value = true;
  }
};


// 삭제 실행 함수
const updateData = () => {
  if (isBulkDelete.value) {
    // 선택된 항목들 삭제
    data.value = data.value.filter(item => !selectedRows.value.includes(item.id));
    selectedRows.value = []; // 선택된 항목 초기화
  } else if (rowToDelete.value) {
    // 개별 항목 삭제
    data.value = data.value.filter(item => item.id !== rowToDelete.value.id);
    rowToDelete.value = null;
  }
  isModalVisible.value = false;
};

const closeModal = () => {
  isModalVisible.value = false;
};

// 적용 함수
const apply = (row) => {
  console.log("Applying changes to row:", row);
};

// 새 데이터 추가 함수
const addNewRow = () => {
  const newRow = { id: Date.now(), name: "New Param", dataValue: "String", order: data.value.length + 1 };
  data.value.push(newRow);
};

// 완료 버튼 클릭 시 데이터 저장
const saveData = () => {
  console.log("입력된 데이터:", selectedOption.value, data.value);
  localStorage.setItem("data", JSON.stringify(data.value));
};



// 테이블보기 모달
const isTableModalVisible = ref(false);
const showTableModal = () => {
  isTableModalVisible.value = true;
};
// DB 테이블 모달 닫기 함수
const closeTableModal = () => {
  isTableModalVisible.value = false;
};
// DB 테이블 데이터 (예제)
const dbTableData = ref([
  { id: 1, fieldName: "TEMP", type: "INT" },
  { id: 2, fieldName: "THIN", type: "영상" },
  { id: 3, fieldName: "STARTD", type: "DATETIME" },
  { id: 4, fieldName: "TEMP", type: "INT" },
  { id: 5, fieldName: "THIN", type: "영상" },
  { id: 6, fieldName: "STARTD", type: "DATETIME" },
  { id: 7, fieldName: "TEMP", type: "INT" },
  { id: 8, fieldName: "THIN", type: "영상" },
]);

// 선택된 DB 테이블 행들
const selectedDbRows = ref([]);

const toggleDbSelection = (id) => {
  if (selectedDbRows.value.includes(id)) {
    selectedDbRows.value = selectedDbRows.value.filter((rowId) => rowId !== id);
  } else {
    selectedDbRows.value.push(id);
  }
};
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="파라미터 등록" />
      <section class="top-wrap">
        <div class="tab-container">
          <div class="tabs">
            <button v-for="(tab, index) in tabs" :key="index" :class="[{ tab: true, active: activeTab === tab }]"
              @click="activeTab = tab">
              {{ tab }}
            </button>
          </div>
          <DropdownMenu v-model="selectedOption" :options="selectedOptions" placeholder="입출력 형식" type="radio"
            :arrowIcon="customArrowIcon" />
        </div>
        <div class="right-wrap">
          <button @click="addNewRow" class="btn-add">파라미터 추가 <img :src="plusIcon"></button>
          <button @click="showDeleteModal()" class="btn-delete">파라미터 삭제 <img :src="deleteIcon"></button>
          <button v-if="activeTab !== '응답 파라미터'" @click="showTableModal" class="btn-table">테이블보기</button>
        </div>
      </section>

      <section class="add-table-form">
        <div class="table-container add-table fiexd">
          <div class="table-header">
            <table class="table-col">
              <colgroup>
                <col style="width: 20%;" />
                <col style="width: 20%;" />
                <col style="width: 20%;" />
                <col style="width: 20%;" />
                <col style="width: 20%;" />
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

          <div v-if="isEmpty" class="non-content">
            <span>내용이 없습니다.</span>
            <button @click="addNewRow">새로 추가</button>
          </div>

          <div class="table-body">
            <table class="table-col">
              <colgroup>
                <col style="width: 20%;" />
                <col style="width: 20%;" />
                <col style="width: 20%;" />
                <col style="width: 20%;" />
                <col style="width: 20%;" />
              </colgroup>
              <tbody>
                <tr v-for="row in data" :key="row.id">
                  <td>
                    <div class="checkbox-container">
                      <input :id="'check-' + row.id" type="checkbox" class="unitcheck checknum" v-model="selectedRows"
                        :value="row.id" />
                      <label :for="'check-' + row.id" class="checkmark"></label>
                    </div>
                  </td>
                  <td><Input v-model="row.name" /></td>
                  <td>
                    <DropdownMenu v-model="row.dataValue" :options="dataValueOptions" type="radio"
                      class="select w110 " />
                  </td>
                  <td>
                    <div class="button-list">
                      <button @click="showDeleteModal(row)" class="action-button btn-delete">삭제</button>
                      <button @click="apply(row)" class="action-button btn-apply">적용</button>
                    </div>
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
          <button @click="saveData" class="btn-save">완료</button>
        </div>
      </section>
      <Modal :show="isModalVisible" title="삭제 확인" @update:show="isModalVisible = $event" @confirm="updateData"
        @cancel="closeModal" :showCloseButton="true">
        <template #default>
          <p>{{ modalMessage }}</p>
        </template>
      </Modal>

    </div>
    <Modal :show="isTableModalVisible" title="DB 테이블" @update:show="isTableModalVisible = $event"
      @confirm="closeTableModal" class="tableModal" :overlayClosable="false" :showCloseButton="true">
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
                <td>{{ row.fieldName }}</td>
                <td>{{ row.type }}</td>
                <td>
                  <div class="checkbox-container">
                    <input :id="'db-check-' + row.id" type="checkbox" class="unitcheck checknum"
                      v-model="selectedDbRows" :value="row.id" />
                    <label :for="'db-check-' + row.id" class="checkmark"></label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #footer>
        <button class="modal-button" @click="closeTableModal">완료</button>
      </template>
    </Modal>

  </div>
</template>
