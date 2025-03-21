<script setup>
import { ref, computed } from "vue";
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
import SignUpForm from "@/components/Login/SignUpForm.vue";
import EditUserForm from "@/components/Login/EditUserForm.vue";

const router = useRouter();
const tableRef = ref(null);
const isSignupModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedUser = ref(null);
const signupForm = ref(null);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref('');
const modalConfirmAction = ref(null);

// 검색 및 필터 상태
const selectedFilter = ref("선택");
const searchQuery = ref("");

const filterOptions = ref([
  { label: "회원명", value: "name" },
  { label: "옵션1", value: "type1" },
  { label: "옵션2", value: "type2" },
  { label: "옵션3", value: "type3" },
  { label: "옵션4", value: "type4" },
]);

const handleFilterChange = (newLabel) => {
  const found = filterOptions.value.find(opt => opt.label === newLabel);
  if (found) selectedFilter.value = found.label;
};

const updateFilter = () => {
  console.log(`"${selectedFilter.value}" 기준으로 "${searchQuery.value}" 검색 실행`);
};

// 테이블 컬럼 정의
const columns = ref([
  { key: "userID", label: "사용자 ID", width: "12%", align: "text-center" },
  { key: "name", label: "회원명", width: "12%", align: "text-center", clickable: true },
  { key: "date", label: "가입일시", width: "12%", align: "text-center" },
  { key: "number", label: "전화번호", width: "12%", align: "text-center" },
  { key: "email", label: "이메일", width: "12%", align: "text-center" },
  { key: "type", label: "회원형태", width: "12%", align: "text-center" },
  { key: "company", label: "회사명", width: "12%", align: "text-center" },
]);

const rowModals = ref({});
const extraColumn = ref({
  key: "action",
  label: "키",
  width: "200px",
  actions: [
    {
      label: "보기",
      className: "btn-keyView",
      handler: (row) => viewkey(row),
    },
  ],
});

// 더미 데이터 (회원 목록)
const data = ref([
  { id: 1, userID: "user001", name: "홍길동", date: "2024-03-18", number: "010-1234-5678", email: "netro@netro.kr", type: "일반", company: "A회사" },
  { id: 2, userID: "user002", name: "김철수", date: "2024-03-17", number: "010-9876-5432", email: "netro@netro.kr", type: "기업", company: "B기업" },
]);


// 회원수정모달열기
const handleCellClick = (row) => {
  selectedUser.value = { ...row };
  isEditModalOpen.value = true;
};

// 회원 수정 모달 닫기 핸들러
const closeEditModal = () => {
  isEditModalOpen.value = false;
};


// 회원가입 모달 열기
const openSignupModal = () => {
  isSignupModalOpen.value = true;
};


const handleShowModal = ({ title, message, type, onConfirm = null }) => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalType.value = type === "error" ? "modal-error" : "modal-success";
  modalConfirmAction.value = onConfirm;
  showModal.value = true;
};

const confirmModalAction = () => {
  if (modalConfirmAction.value) {
    modalConfirmAction.value();
  }
  showModal.value = false;
};



// 회원가입 완료 시 모달 닫기
const handleSignupSuccess = () => {
  console.log("회원가입 완료됨! 모달을 닫습니다.");
  isSignupModalOpen.value = false; // 모달 닫기
};


const viewkey = (row) => {
  rowModals.value[row.id] = {
    show: true,
    title: "API KEY",
    message: `
    <div class="text">
     <div class="txt"> <b>솔루션</b>:<p>dfsafsesf26436452!@#%%</p> </div>
     <div class="txt"> <b>DT</b>: <p>신청하지않음</p></div>
      </div>
    `,
    type: "info"
  };
};
const selectedRows = computed(() => tableRef.value?.selectedRows || []);

const deleteModal = ref({
  show: false,
  title: "삭제 확인",
  message: "선택한 항목을 정말 삭제하시겠습니까?",
  type: "warning",
  onConfirm: null,
});

const openDeleteConfirmModal = () => {
  if (selectedRows.value.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }

  deleteModal.value = {
    ...deleteModal.value,
    show: true,
    onConfirm: null, // 삭제 기능 없음
  };
};


</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="회원 관리" />
      <!-- 검색 -->
      <div class="SearchBar right">
        <div class="buttons">
          <Button class="btn-success" @click="openSignupModal" label="추가" />
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
      <!-- 테이블 -->
      <div class="fix-table">
        <DataTable ref="tableRef" :columns="columns" :data="data" :extraColumn="extraColumn" :selectable="true"
          class="useList fix fixed" :clickable="true" @cell-click="handleCellClick" />
        <PaginationsView />
      </div>
    </div>

    <!-- 회원가입 모달 -->
    <Modal v-model:show="isSignupModalOpen" :showButtons="false" class="signModal">
      <SignUpForm ref="signupForm" isAdminMode="true" @signupSuccess="handleSignupSuccess"
        @closeModal="isSignupModalOpen = false" @showModal="handleShowModal" :isModal="true" />
    </Modal>
    <!-- 회원가입완료 모달 -->
    <Modal :show="showModal" :title="modalTitle" :message="modalMessage" :modalClass="modalType"
      @confirm="confirmModalAction" @close="showModal = false" :showCancel="false" :showCloseButton="true"
      :overlayClosable="false" />
    <!-- 키보기 모달 -->
    <template v-for="(modal, rowId) in rowModals" :key="rowId">
      <Modal :show="modal.show" :title="modal.title" :modalClass="modal.type" @confirm="modal.show = false"
        @close="modal.show = false" :showCancel="false" :showCloseButton="true" class="informModal"
        :overlayClosable="false">
        <div v-html="modal.message"></div>
      </Modal>
    </template>
    <!-- 삭제경고모달 -->
    <Modal :show="deleteModal.show" :title="deleteModal.title" :modalClass="deleteModal.type"
      @confirm="deleteModal.show = false" @close="deleteModal.show = false" :showCancel="true" :showCloseButton="true"
      :overlayClosable="false">
      <p>{{ deleteModal.message }}</p>
    </Modal>

    <!-- 회원 수정 모달 -->
    <Modal :show="isEditModalOpen" :showButtons="false" class="editModal">
      <EditUserForm v-if="selectedUser" :user="selectedUser" @closeModal="closeEditModal" />
    </Modal>

  </div>
</template>
