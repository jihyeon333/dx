<script setup>
import { ref } from "vue";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import SearchBar from "@/components/common/SearchBar.vue";
import DataTable from "@/components/common/DataTable.vue";
import Modal from "@/components/common/Modal.vue"; // ✅ 모달 컴포넌트 추가

const endpoint = ref("http://ai.solution.com/ID (학습)");

// ✅ 모달 상태 및 삭제할 파라미터가 있는 행 저장
const confirmModal = ref(false);
const selectedRow = ref(null);

// ✅ 파라미터 삭제 모달 열기
const openParameterDeleteModal = (row) => {
  selectedRow.value = row;
  confirmModal.value = true;
};

// ✅ 모달에서 "확인"을 누르면 해당 행의 파라미터만 삭제
const confirmDeleteParameter = () => {
  if (selectedRow.value) {
    selectedRow.value.parameter = ""; // ✅ 파라미터 값 비움
  }
  closeModal();
};

// ✅ 모달 닫기
const closeModal = () => {
  selectedRow.value = null;
  confirmModal.value = false;
};

// ✅ 테이블 컬럼 정의
const columns = ref([
  { key: "name", label: "연계명", width: "100px", align: "text-center" },
  { key: "processType", label: "공정종류", width: "20%", align: "text-center" },
  { key: "processName", label: "공정명", width: "20%", align: "text-center" },
  { key: "linkId", label: "연계 ID", width: "20%", align: "text-center" },
  { key: "aiType", label: "AI 종류", width: "20%", align: "text-center" },
]);

// ✅ 테이블 데이터 정의
const data = ref([
  { name: "압연DPS", processType: "압연", processName: "구미열압", linkId: "GumiHM", aiType: "학습", parameter: "12345" },
  { name: "압연검사", processType: "영상", processName: "구미냉압", linkId: "GumiM", aiType: "예측", parameter: "67890" },
  { name: "압연분석", processType: "분석", processName: "포항코팅", linkId: "PohangC", aiType: "학습", parameter: "11111" },
]);

// ✅ 추가 컬럼 (삭제 버튼 클릭 시 `openParameterDeleteModal` 호출)
const extraColumn = ref({
  key: "parameter",
  label: "파라미터",
  width: '200px',
  actions: [
    {
      label: "삭제",
      className: "btn-delete",
      handler: openParameterDeleteModal, // ✅ 파라미터 삭제 모달 열기
    },
    {
      label: "보기",
      className: "btn-view",
      handler: (row) => alert(`보기 클릭: ${row.name}`),
    },
  ],
});

// ✅ 필터 옵션 정의
const filterOptions = ref(["연계명", "공정종류", "공정명", "연계ID", "AI종류"]);


const selectable = ref(true);
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="연계 목록" />
      <CardBox>
        <div class="content">
          <p>연계 endpoint :</p>
          <Input v-model="endpoint" :is-disabled="true" readonly />
        </div>
      </CardBox>

      <SearchBar :filterOptions="filterOptions" @filterChange="handleFilterChange" :buttons="[
        { label: '추가', className: 'btn-success', onClick: addRow },
        { label: '삭제', className: 'btn-danger', onClick: deleteSelectedRows }
      ]" />

      <DataTable :columns="columns" :data="data" :extraColumn="extraColumn" :selectable="selectable" ref="tableRef"
        class="fix fiexd" />

      <!-- ✅ 파라미터 삭제 확인 모달 -->
      <Modal :show="confirmModal" title="삭제 경고" :message="selectedRow ? `정말로 삭제하시겠습니까?` : ''" confirmText="확인"
        cancelText="취소" @confirm="confirmDeleteParameter" @close="closeModal" @cancel="closeModal"
        :overlayClosable="false" :showCloseButton="true" class="confirmModal" />
    </div>
  </div>
</template>
