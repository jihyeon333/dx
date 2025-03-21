<script setup>
import { reactive, ref } from "vue";
import Title from '@/components/common/Title.vue';
import Button from "@/components/common/Button.vue";
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import Input from "@/components/common/Input.vue";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";
import Modal from "@/components/common/Modal.vue";

// ApprovalModal 및 rejectionModal 객체 추가
const ApprovalModal = reactive({
  show: false,
  title: "회원 승인 확인",
  message: "선택한 회원을 승인하시겠습니까?",
});

const rejectionModal = reactive({
  show: false,
  title: "회원 거절 확인",
  message: "선택한 회원을 거절하시겠습니까?",
});

const tabs = ref([
  { name: "가입대기 목록", value: "tab1" },
  { name: "API키 승인 대기 목록", value: "tab2" },
]);

const categories = ref([
  { name: "연계명", value: "name" },
  { name: "공정종류", value: "processType" },
  { name: "공정명", value: "processName" },
  { name: "연계 ID", value: "endpoint" },
  { name: "AI 종류", value: "type" },
]);

const activeTab = ref(tabs.value[0].value);
const isActive = (tab) => activeTab.value === tab.value;
// 필터 및 검색 상태
const selectedFilter = ref("연계명");
const searchQuery = ref("");

// 선택된 회원 저장
const selectedRows = reactive([]);

const updateSelectedRows = (rows) => {
  selectedRows.length = 0;
  rows.forEach((row) => selectedRows.push(row));
};

// 승인 모달 열기 함수
const openApprovalModal = () => {
  if (selectedRows.length === 0) {
    alert("승인할 회원을 선택하세요.");
    return;
  }
  ApprovalModal.show = true;
};

// 거절 모달 열기 함수
const openRejectionModal = () => {
  if (selectedRows.length === 0) {
    alert("거절할 회원을 선택하세요.");
    return;
  }
  rejectionModal.show = true;
};

// 승인 처리 함수
const approveSelectedUsers = () => {
  ApprovalModal.show = false;
  console.log("회원 승인 처리:", selectedRows);
};

// 거절 처리 함수
const rejectSelectedUsers = () => {
  rejectionModal.show = false;
  console.log("회원 거절 처리:", selectedRows);
};

// 테이블 컬럼 정의
const columnsSignUp = ref([
  { key: "userID", label: "사용자 ID", width: "15%", align: "text-center" },
  { key: "name", label: "회원명", width: "15%", align: "text-center" },
  { key: "date", label: "가입일시", width: "15%", align: "text-center" },
  { key: "number", label: "전화번호", width: "15%", align: "text-center" },
  { key: "email", label: "이메일", width: "15%", align: "text-center" },
  { key: "type", label: "회원형태", width: "15%", align: "text-center" },
  { key: "company", label: "회사명", width: "15%", align: "text-center" },
]);

const columnsAPIKey = ref([
  { key: "userID", label: "사용자 ID", width: "15%", align: "text-center" },
  { key: "name", label: "회원명", width: "15%", align: "text-center" },
  { key: "date", label: "가입일시", width: "15%", align: "text-center" },
  { key: "number", label: "전화번호", width: "15%", align: "text-center" },
  { key: "email", label: "이메일", width: "15%", align: "text-center" },
  { key: "type", label: "회원형태", width: "15%", align: "text-center" },
  { key: "company", label: "회사명", width: "15%", align: "text-center" },
]);

const dataSignUp = ref([
  { id: 1, userID: "user001", name: "홍길동", date: "2024-03-18", number: "010-1234-5678", email: "netro@netro.kr", type: "일반", company: "A회사" },
  { id: 2, userID: "user002", name: "김철수", date: "2024-03-17", number: "010-9876-5432", email: "netro@netro.kr", type: "기업", company: "B기업" },
]);

const dataAPIKey = ref([
  { id: 1, userID: "user001", name: "홍길동", date: "2024-03-18", number: "010-1234-5678", email: "netro@netro.kr", type: "일반", company: "A회사" },
  { id: 2, userID: "user002", name: "김철수", date: "2024-03-17", number: "010-9876-5432", email: "netro@netro.kr", type: "기업", company: "B기업" },
]);
</script>


<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="사용자승인목록" />
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
        </div>

        <!-- 검색 바 -->
        <div class="SearchBar right">
          <div class="buttons">
            <Button class="btn-success" @click="openApprovalModal" label="승인" />
            <Button class="btn-delete" @click="openRejectionModal" label="거절" />
          </div>
          <div class="SearchFilter">
            <!-- 필터 드롭다운 메뉴 -->
            <DropdownMenu v-model="selectedFilter" :options="categories.map(cat => cat.name)" placeholder="필터를 선택하세요"
              type="radio" :arrowIcon="customArrowIcon" />

            <!-- 검색 입력창 -->
            <div class="Search">
              <Input v-model="searchQuery" placeholder="검색어를 입력해주세요." class="search-input" />
              <Button :icon="faSearch" @click="updateFilter" class="search-btn" />
            </div>
          </div>
        </div>

      </section>
    </div>
    <section class="tab-contents">
      <!-- 테이블 -->
      <div v-if="activeTab === 'tab1'" class="tab-content">
        <div class="fix-table">
          <DataTable ref="tableSignUp" :columns="columnsSignUp" :data="dataSignUp" :selectable="true"
            @update:selectedRows="updateSelectedRows" class="useList fix fixed" />

          <PaginationsView />
        </div>
      </div>
      <div v-if="activeTab === 'tab2'" class="tab-content">
        <div class="fix-table">
          <DataTable ref="tableAPIKey" :columns="columnsAPIKey" :data="dataAPIKey" :selectable="true"
            @update:selectedRows="updateSelectedRows" class="useList fix fixed" />

          <PaginationsView />
        </div>
      </div>
    </section>
    <!-- 승인모달 -->
    <Modal :show="ApprovalModal.show" :title="ApprovalModal.title" @confirm="approveSelectedUsers"
      @close="ApprovalModal.show = false" :showCancel="true" :showCloseButton="true" :overlayClosable="false">
      <p>{{ ApprovalModal.message }}</p>
    </Modal>

    <!-- 거절모달 -->
    <Modal :show="rejectionModal.show" :title="rejectionModal.title" @confirm="rejectSelectedUsers"
      @close="rejectionModal.show = false" :showCancel="true" :showCloseButton="true" :overlayClosable="false">
      <p>{{ rejectionModal.message }}</p>
    </Modal>

  </div>
</template>
