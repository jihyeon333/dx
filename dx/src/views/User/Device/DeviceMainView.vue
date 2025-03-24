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



const router = useRouter();

const totalItems = ref(50);
const extraColumn = ref(null);
const dataTableRef = ref(null);
const selectedRows = ref([]);


const selectedCategory = ref("");
const keyword = ref("");
const categories = ref([
  { name: "전체", value: "all" },
  { name: "장비명", value: "deviceName" },
  { name: "프로토콜", value: "protocol" },
  { name: "수집주기", value: "cycle" },
]);

const columns = ref([
  { key: "deviceName", label: "장비명", width: "17%", align: "text-center", clickable: true },
  { key: "type", label: "종류", width: "17%", align: "text-center" },
  { key: "protocol", label: "프로토콜", width: "17%", align: "text-center" },
  { key: "cycle", label: "주기(초)", width: "17%", align: "text-center" },
  {
    key: "form",
    label: "입출력양식",
    width: "17%",
    type: "button",
    buttonLabel: "보기",
    className: "btn-view",
    onClick: (row) => {
      console.log("입출력 설정 클릭", row);
    }
  },
]);

// 더미 데이터 (회원 목록)
const data = ref([
  { id: 1, deviceName: "냉각압연_1", type: "압연", protocol: "OPC-UA", cycle: "5" },
  { id: 2, deviceName: "검사CCTV", type: "영상", protocol: "MQTT", cycle: "5" },
  { id: 3, deviceName: "소재측정", type: "상태", protocol: "PLC", cycle: "5" },
  { id: 4, deviceName: "온도계_지상", type: "온도", protocol: "OPC-UA", cycle: "60" },
  { id: 5, deviceName: "습도계", type: "습도", protocol: "MQTT", cycle: "60" },
  { id: 6, deviceName: "냉각압연_1", type: "압연", protocol: "OPC-UA", cycle: "5" },
  { id: 7, deviceName: "검사CCTV", type: "영상", protocol: "MQTT", cycle: "5" },
  { id: 8, deviceName: "소재측정", type: "상태", protocol: "PLC", cycle: "5" },
  { id: 9, deviceName: "온도계_지상", type: "온도", protocol: "OPC-UA", cycle: "60" },
  { id: 10, deviceName: "습도계", type: "습도", protocol: "MQTT", cycle: "60" },
]);



</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="장비 목록" />
      <div class="SearchBar right">
        <div class="buttons">
          <Button class=" btn-success" @click="router.push({ name: 'deviceAdd' })" label="추가" />
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


  </div>
</template>