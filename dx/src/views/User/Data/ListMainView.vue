<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Title from "@/components/common/Title.vue";
import Button from "@/components/common/Button.vue";
import DateRangePicker from '@/components/common/DateRangePicker.vue';
import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";

const route = useRoute();
const processName = route.query.processName;

const router = useRouter();

const totalItems = ref(50);
const dataTableRef = ref(null);

// 날짜 범위
const dateRange = ref([]);


const columns = ref([
  { key: "deviceName", label: "장비명", width: "20%", align: "text-center", clickable: true },
  { key: "type", label: "종류", width: "10%", align: "text-center" },
  { key: "protocol", label: "프로토콜", width: "20%", align: "text-center" },
  { key: "startAt", label: "시작", width: "20%", align: "text-center" },
  { key: "endAt", label: "종료", width: "20%", align: "text-center" },
  { key: "cycle", label: "주기", width: "10%", align: "text-center" },
]);


const data = ref([
  { id: 1, deviceName: "냉각압연_1", type: "압연", protocol: "OPC-UA", startAt: "2025.01.02. 18:30", endAt: "2025.01.02. 18:30", cycle: "5" },])


</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title :text="`공정 목록 - ${processName}`" />
      <div class="SearchBar right">
        <div class="date-range data-time-range">
          <DateRangePicker v-model="dateRange" placeholder="날짜 범위 선택" class="search-date" :isRange="true"
            :enableTime="true" />
        </div>
        <Button label="검색" class="search-btn" />
      </div>
      <div class="fix-table data-table">
        <DataTable ref="dataTableRef" :columns="columns" :data="data" @update:data="handleUpdateRow" class="fix fixed"
          :clickable="true" @cell-click="goToEditPage" />
        <PaginationsView :totalItems="totalItems" ref="paginationRef" />
      </div>
    </div>
  </div>
</template>