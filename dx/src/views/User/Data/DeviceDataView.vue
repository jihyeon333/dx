<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Title from "@/components/common/Title.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import Button from "@/components/common/Button.vue";
import DateRangePicker from '@/components/common/DateRangePicker.vue';
import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";

const route = useRoute();
const deviceName = computed(() => route.query.deviceName || '');
const processName = route.query.processName;

const router = useRouter();

const totalItems = ref(50);
const dataTableRef = ref(null);

const selectedRows = ref([]);

onMounted(() => {
  const path = route.path;
  if (path.includes("/graph/")) selectedView.value = "관리 그래프";
  else selectedView.value = "관리 리스트";
});

// 날짜 범위
const dateRange = ref([]);


const isDownloadButtonDisabled = computed(() => selectedRows.value.length === 0);

const columns = ref([
  { key: "deviceType", label: "장비종류", width: "20%", align: "text-center" },
  { key: "materialType", label: "소재종류", width: "20%", align: "text-center" },
  { key: "thick", label: "소재두께(mm)", width: "20%", align: "text-center" },
  { key: "date", label: "수집일시", width: "20%", align: "text-center" },
  { key: "cycle", label: "주기(초)", width: "20%", align: "text-center" },
]);


const data = ref([
  { id: 1, deviceType: "압연", materialType: "강철", thick: "55", date: "2025.01.02. 18:30", cycle: "5" },
  { id: 2, deviceType: "압연", materialType: "강철", thick: "55", date: "2025.01.02. 18:30", cycle: "5" },
  { id: 3, deviceType: "압연", materialType: "강철", thick: "55", date: "2025.01.02. 18:30", cycle: "5" },
  { id: 4, deviceType: "압연", materialType: "강철", thick: "55", date: "2025.01.02. 18:30", cycle: "5" },
  { id: 5, deviceType: "압연", materialType: "강철", thick: "55", date: "2025.01.02. 18:30", cycle: "5" },
  { id: 6, deviceType: "압연", materialType: "강철", thick: "55", date: "2025.01.02. 18:30", cycle: "5" },
]);



const selectedView = ref("관리 리스트");

watch(selectedView, (val) => {
  const processId = route.params.processId;
  const processName = route.query.processName;
  const deviceName = route.query.deviceName;
  const basePath = `/user/data/list/${processId}`;
  const query = { processName, deviceName };

  if (!processId || !processName) return;

  if (val === "관리 리스트") {
    router.push({ path: `${basePath}`, query });
  } else if (val === "관리 그래프") {
    const defaultDeviceId = data.value[0]?.id || 1;
    router.push({ path: `${basePath}/graph/${defaultDeviceId}`, query });
  }
});



const goToEditPage = (row, column) => {
  if (column.key !== 'deviceName') return;

  const processId = route.params.processId;
  const processName = route.query.processName;
  const deviceId = row.id;
  const deviceName = row.deviceName;

  if (selectedView.value === "관리 리스트") {
    router.push({
      name: "dataDeviceView",
      params: { processId },
      query: { processName, deviceId, deviceName },
    });
  } else if (selectedView.value === "관리 그래프") {
    router.push({
      name: "dataGraph",
      params: { processId, deviceId },
      query: { processName, deviceName },
    });
  }
};



</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <div class="title-wrap">
        <Title :text="`공정 목록 - 수집 장비`" />
        <Breadcrumb :items="[
          { name: '전체 공정 리스트', path: '/user/data/' },
          { name: processName, path: `/user/data/list/${route.params.processId}?processName=${processName}` },
          {
            name: deviceName,
            path:
              selectedView === '관리 그래프'
                ? `/user/data/list/${route.params.processId}/graph/${route.params.deviceId}?processName=${processName}&deviceName=${deviceName}`
                : `/user/data/list/${route.params.processId}/view?processName=${processName}&deviceId=${route.query.deviceId}&deviceName=${deviceName}`
          }
        ]" :showDropdown="true" :dropdownOptions="['관리 리스트', '관리 그래프']" v-model:selectedView="selectedView" />
      </div>
      <div class="SearchBar right">
        <Button :label="'다운로드'" :class="'download-btn'" :disabled="isDownloadButtonDisabled" />
        <div class="date-range data-time-range">
          <DateRangePicker v-model="dateRange" placeholder="날짜 범위 선택" class="search-date" :isRange="true"
            :enableTime="true" />
        </div>
        <Button label="검색" class="search-btn" />
        <Button label="삭제" class="btn-delete" />
      </div>
      <div class="fix-table data-table">
        <DataTable ref="dataTableRef" :columns="columns" :data="data" :selectable="true" v-model:selected="selectedRows"
          @update:data="handleUpdateRow" class="fix fixed" :clickable="true" @cell-click="goToEditPage" />
        <PaginationsView :totalItems="totalItems" ref="paginationRef" />
      </div>
    </div>
  </div>
</template>