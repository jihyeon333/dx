<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import Input from "@/components/common/Input.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";


const selectedView = ref("관리 리스트");

onMounted(() => {
  localStorage.removeItem("selectedDeviceId");
});

const router = useRouter();
const route = useRoute();
const processId = computed(() => route.params.processId || '');
const processName = computed(() => route.query.processName || '');
const totalItems = ref(50);
const dataTableRef = ref(null);

const selectedCategory = ref("");
const keyword = ref("");
const categories = ref([
  { name: "전체", value: "all" },
  { name: "공정명", value: "name" },
  { name: "상태", value: "status" },
  { name: "생성일시", value: "createdAt" },
  { name: "시작일시", value: "startAt" },
  { name: "종료일시", value: "endAt" },
]);




const columns = ref([
  { key: "processName", label: "공정명", width: "20%", align: "text-center", clickable: true },
  { key: "status", label: "상태", width: "20%", align: "text-center", type: "badge" },
  { key: "createdAt", label: "생성일시", width: "20%", align: "text-center" },
  { key: "startAt", label: "시작일시", width: "20%", align: "text-center" },
  { key: "endAt", label: "종료일시", width: "20%", align: "text-center" },
]);


const data = ref([
  { id: 1, processName: "냉각압연", status: "진행중", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
  { id: 2, processName: "프레스", status: "중지", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
  { id: 3, processName: "용접", status: "진행중", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
  { id: 4, processName: "표면처리", status: "진행중", createdAt: "2025.01.01", startAt: "2025.01.01. 09:10", endAt: "2025.01.02. 18:30" },
]);


const goToEditPage = (row, column) => {
  if (!column || column.key !== 'processName') return;

  const processId = row.id;
  localStorage.setItem("selectedDeviceId", processId);

  router.push({
    path: `/user/data/list/${processId}`,
    query: { processName: row.processName },
  });
};



watch(selectedView, (val) => {
  const basePath = "/user/data/";
  if (val === "관리 리스트") {
    router.push(basePath);
  } else if (val === "관리 그래프") {
    router.push(basePath + "graph");
  }
});


</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <div class="title-wrap">
        <Title text="공정 목록" />
        <Breadcrumb :items="[
          { name: '전체 공정 리스트', path: '/user/data/' }
        ]" :showDropdown="false" v-model:selectedView="selectedView" />
      </div>
      <div class="SearchBar right">
        <div class="SearchFilter">
          <DropdownMenu v-model="selectedCategory" :options="categories" option-label="name" option-value="value"
            type="radio" :arrowIcon="customArrowIcon" />
          <div class="date" :class="{ show: isDateCategory }">
            <DateRangePicker class="search-date" :isRange="false" :enableTime="true" />
          </div>
          <div class="Search" v-if="!isDateCategory">
            <Input v-model="keyword" placeholder="검색어를 입력해주세요." class="search-input" />
          </div>
          <Button @click="handleSearch" class="search-button" label="검색" />
        </div>
      </div>
      <div class="fix-table data-table">
        <DataTable ref="dataTableRef" :columns="columns" :data="data" @update:data="handleUpdateRow" class="fix fixed"
          :clickable="true" @cell-click="goToEditPage" />
        <PaginationsView :totalItems="totalItems" ref="paginationRef" />
      </div>
    </div>

  </div>
</template>