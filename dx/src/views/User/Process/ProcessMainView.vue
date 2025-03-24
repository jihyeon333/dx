<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import Input from "@/components/common/Input.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";

import Modal from "@/components/common/Modal.vue";

const router = useRouter();

const totalItems = ref(50);
const extraColumn = ref(null);
const dataTableRef = ref(null);
const selectedRows = ref([]);


const selectedCategory = ref("");
const keyword = ref("");
const categories = ref([
  { name: "전체", value: "all" },
  { name: "상태", value: "status" },
  { name: "생성일시", value: "createdAt" },
  { name: "시작일시", value: "startAt" },
  { name: "종료일시", value: "endAt" },
]);


const columns = ref([
  { key: "processName", label: "공정명", width: "17%", align: "text-center", clickable: true },
  { key: "status", label: "상태", width: "17%", align: "text-center", type: "badge" },
  { key: "createdAt", label: "생성일시", width: "17%", align: "text-center" },
  { key: "startAt", label: "시작일시", width: "17%", align: "text-center" },
  { key: "endAt", label: "종료일시", width: "17%", align: "text-center" },
  { key: "changeState", label: "상태변경", width: "17%", align: "text-center", type: "toggle-button" },
]);

// 더미 데이터 (회원 목록)
const data = ref([
  { id: 1, processName: "냉각압연", status: "진행중", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
  { id: 2, processName: "프레스", status: "중지", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
  { id: 3, processName: "용접", status: "진행중", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
  { id: 4, processName: "표면처리", status: "진행중", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
]);

const showDeleteModal = ref(false);

const openDeleteConfirmModal = () => {
  if (selectedRows.value.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  // 실제 삭제 로직 실행
  console.log("삭제 실행"); // 또는 emit / API 호출
  showDeleteModal.value = false;
};


const goToEditPage = (row) => {
  router.push({
    name: "ProcessEdit", // 실제 등록된 라우트 이름 사용
    query: { id: row.id },
  });
};

const handleSearch = () => {
  console.log("검색 실행:", selectedCategory.value, keyword.value);
  // 실제 필터링 or API 요청 로직 추가 가능
};

const handleUpdateRow = (id, patch) => {
  const index = data.value.findIndex((row) => row.id === id);
  if (index !== -1) {
    data.value[index] = {
      ...data.value[index],
      ...patch, // status만 변경됨
    };
  }
};

</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="공정 관리" />
      <div class="SearchBar right">
        <div class="buttons">
          <Button class=" btn-success" @click="router.push({ name: 'ProcessAdd' })" label="추가" />
          <Button class=" btn-delete" @click="openDeleteConfirmModal" label="삭제" />
        </div>
        <div class="SearchFilter">
          <DropdownMenu v-model="selectedCategory" :options="categories.map(opt => opt.name)" type="radio"
            :arrowIcon="customArrowIcon" />
          <div class="Search">
            <Input v-model="keyword" placeholder="검색어를 입력해주세요." class="search-input" />
            <Button :icon="faSearch" @click="handleSearch" class="search-btn" />
          </div>
        </div>
      </div>
      <div class="fix-table">
        <DataTable ref="dataTableRef" v-model:selected="selectedRows" :columns="columns" :data="data"
          @update:data="handleUpdateRow" :extraColumn="extraColumn" :selectable="true" class="fix fixed"
          :clickable="true" @cell-click="goToEditPage" />
        <PaginationsView :totalItems="totalItems" ref="paginationRef" />
      </div>
    </div>
    <Modal :show="showDeleteModal" title="공정 관리 삭제 확인" :message="`${selectedRows.length}개의 항목을 삭제하시겠습니까?`"
      confirmText="확인" cancelText="취소" @confirm="confirmDelete" @close="showDeleteModal = false"
      @cancel="showDeleteModal = false" />

  </div>
</template>