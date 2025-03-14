<script setup>
import { ref, nextTick, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import DataTable from "@/components/common/DataTable.vue";
import Modal from "@/components/common/Modal.vue";
import Button from "@/components/common/Button.vue";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PaginationsView from "@/components/common/PaginationsView.vue";

const endpoint = ref("http://ai.solution.com/ID (학습)");
const router = useRouter();
const modalState = reactive({
  confirmDelete: false,
  confirmParameter: false,
});

// 테이블 참조
const tableRef = ref(null);

// 선택된 행 상태
const selectedRows = ref([]);
const selectedParameterRow = ref(null);

// 검색 및 필터 상태
const selectedFilter = ref("연계명");
const searchQuery = ref("");

const filterOptions = ref([
  { label: "연계명", value: "name" },
  { label: "공정종류", value: "processType" },
  { label: "공정명", value: "processName" },
  { label: "연계 ID", value: "endpoint" },
  { label: "AI 종류", value: "type" },
]);

const handleFilterChange = (newLabel) => {
  const found = filterOptions.value.find(opt => opt.label === newLabel);
  if (found) selectedFilter.value = found.label;
};

const updateFilter = () => {
  console.log(`"${selectedFilter.value}" 기준으로 "${searchQuery.value}" 검색 실행`);
};

const addRow = () => {
  router.push({ name: "SolutionAdd" });
};

const columns = ref([
  { key: "name", label: "연계명", width: "17%", align: "text-center", clickable: true },
  { key: "processType", label: "공정종류", width: "17%", align: "text-center" },
  { key: "processName", label: "공정명", width: "17%", align: "text-center" },
  { key: "endpoint", label: "연계 ID", width: "17%", align: "text-center" },
  { key: "type", label: "AI 종류", width: "17%", align: "text-center" },
]);

const goToEditPage = (row) => {
  router.push({ name: "SolutionEdit", query: { id: row.id } });
};

const handleCellClick = (row, columnKey) => {
  if (columnKey === "name") goToEditPage(row);
};

const data = ref([
  { id: 1, name: "압연DPS", processType: "압연", processName: "구미열압", endpoint: "GumiHM", type: "학습", parameter: "12345" },
  { id: 2, name: "압연검사", processType: "영상", processName: "구미냉압", endpoint: "GumiM", type: "예측", parameter: "67890" },
  { id: 3, name: "압연분석", processType: "분석", processName: "포항코팅", endpoint: "PohangC", type: "학습", parameter: "11111" },
]);

const extraColumn = ref({
  key: "parameter",
  label: "파라미터",
  width: "200px",
  actions: [
    {
      label: "삭제",
      className: "btn-delete",
      handler: (row) => openParameterDeleteModal(row),
    },
    {
      label: "보기",
      className: "btn-view",
      handler: (row) => viewParameter(row),
    },
  ],
});

onMounted(async () => {
  await nextTick();
  console.log("onMounted - tableRef:", tableRef.value);
});

const openDeleteConfirmModal = async () => {
  await nextTick();

  console.log("tableRef:", tableRef.value);
  console.log("getSelectedRows exists:", typeof tableRef.value?.getSelectedRows === "function");

  if (!tableRef.value || typeof tableRef.value.getSelectedRows !== "function") {
    console.error("테이블 참조가 올바르지 않습니다.");
    return;
  }

  selectedRows.value = [...(tableRef.value.getSelectedRows() || [])];

  console.log("선택된 행:", selectedRows.value);

  if (selectedRows.value.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }

  modalState.confirmDelete = true;
};

const confirmDeleteRows = () => {
  if (!selectedRows.value.length) {
    console.error("삭제할 항목이 없습니다.");
    return;
  }
  data.value = data.value.filter(row => !selectedRows.value.some(selRow => selRow.id === row.id));
  selectedRows.value = [];
  confirmDeleteModal.value = false;
};

const viewParameter = (row) => {
  router.push({
    name: "SolutionParams",
    query: { id: row.id, name: row.name },
  });
};

const openParameterDeleteModal = (row) => {
  selectedParameterRow.value = row;
  modalState.confirmParameter = true; // 상태 변경
};

//  파라미터 삭제 확인
const confirmDeleteParameter = () => {
  if (selectedParameterRow.value) {
    selectedParameterRow.value.parameter = "";
  }
  confirmParameterModal.value = false;
};
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="연계 목록" />
      <CardBox>
        <div class="content">
          <p>연계 endpoint :</p>
          <Input :model-value="endpoint" :is-disabled="true" readonly />
        </div>
      </CardBox>
      <div class="SearchBar right">
        <div class="buttons">
          <Button class="btn-success" @click="addRow" label="추가" />
          <Button class="btn-delete" @click="openDeleteConfirmModal" label="삭제" />
        </div>
        <div class="SearchFilter">
          <DropdownMenu v-model="selectedFilter" :options="filterOptions.map(opt => opt.label)" placeholder="필터를 선택하세요"
            type="radio" :arrowIcon="customArrowIcon" @update:modelValue="handleFilterChange" />
          <div class="Search">
            <Input v-model="searchQuery" placeholder="검색어를 입력해주세요." class="search-input" />
            <Button :icon="faSearch" @click="updateFilter" class="search-btn" />
          </div>
        </div>
      </div>
      <div class="fix-table">
        <DataTable ref="tableRef" :columns="columns" :data="data" :extraColumn="extraColumn" :selectable="true"
          class="fixed" :clickable="true" @cell-click="handleCellClick" />
        <PaginationsView />
      </div>
    </div>
    <Modal :show="modalState.confirmDelete" title="연계 삭제 확인"
      :message="selectedRows.length ? `${selectedRows.length}개의 항목을 삭제하시겠습니까?` : ''" confirmText="확인" cancelText="취소"
      @confirm="confirmDeleteRows" @close="modalState.confirmDelete = false" @cancel="modalState.confirmDelete = false"
      class="confirmModal" />

    <Modal :show="modalState.confirmParameter" title="파라미터 삭제 확인"
      :message="selectedParameterRow ? `선택된 파라미터를 삭제하시겠습니까?` : ''" confirmText="확인" cancelText="취소"
      @confirm="confirmDeleteParameter" @close="modalState.confirmParameter = false"
      @cancel="modalState.confirmParameter = false" class="confirmModal" />
  </div>
</template>
