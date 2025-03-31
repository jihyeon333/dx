<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import Input from "@/components/common/Input.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";
import Modal from "@/components/common/Modal.vue";
import processApi from "@/api/processApi";
import { PROCESS_CATEGORIES, STATUS_TYPES } from "@/constants";
import dayjs from 'dayjs';

const isInitialized = ref(false);

onMounted(async () => {
  init();

  await nextTick();

  isInitialized.value = true;
});

const router = useRouter();

const statusTypes = ref(STATUS_TYPES);

const fields = ref([]);

const searchParams = ref({});

const paginationRef = ref(null);

const init = () => {
  searchParams.value = {
    category: "name",
    keyword: "",
    page: 1,
    size: paginationRef.value?.perPageOptions[0]
  };

  executeSearch();
};

const categories = ref(PROCESS_CATEGORIES);

const isDateCategory = computed(() => selectedCategory.value.endsWith("at"));

const selectedCategory = ref(categories.value[0].value);

const keyword = ref("");

const currentPage = computed(() => paginationRef.value?.currentPage || []);

const selectedSize = computed(() => paginationRef.value?.selectedPerPage || []);

const handleSearch = () => {
  searchParams.value = {
    category: selectedCategory.value,
    keyword: (() => {
      if (selectedCategory.value === "status") {
        return statusTypes.value.find(o => o.name === keyword.value)?.value || keyword.value;
      }

      if (isDateCategory.value) {
        const [date, time] = keyword.value.split(" ");
        return `${date}T${time}:00+09:00`;
      }

      return keyword.value;
    })(),
    page: currentPage.value,
    size: selectedSize.value
  };

  executeSearch();
};

const totalItems = ref(0);

const executeSearch = async () => {
  try {
    const { data: { total, processes } } = await processApi.get("/process", {
      params: searchParams.value
    });

    totalItems.value = total;

    fields.value = processes.map(d => ({
      ...d,
      ...["createdAt", "startedAt", "finishedAt"].reduce((acc, key) => {
        acc[key] = dayjs(d[key]).format("YYYY-MM-DD HH:MM");
        return acc;
      }, {}),
      status: statusTypes.value.find(o => o.value === d.status)?.name
    }));
  } catch (e) {
    alert("데이터를 가져오는 데 실패했습니다.");
  }
};

watch(
  [() => currentPage.value, () => selectedSize.value], () => {
    if (isInitialized.value) {
      handleSearch();
    }
  }
);

// TODO 필요?
const extraColumn = ref(null);

const dataTableRef = ref(null);

const selectedRows = ref([]);

const columns = ref([
  { key: "name", label: "공정명", width: "17%", align: "text-center", clickable: true },
  { key: "status", label: "상태", width: "17%", align: "text-center", type: "badge" },
  { key: "createdAt", label: "생성일시", width: "17%", align: "text-center" },
  { key: "startedAt", label: "시작일시", width: "17%", align: "text-center" },
  { key: "finishedAt", label: "종료일시", width: "17%", align: "text-center" },
  { key: "statusChange", label: "상태변경", width: "17%", align: "text-center", type: "toggle-button" },
]);

const goToEditPage = (row) => {
  router.push({ name: "ProcessEdit", query: { id: row.id } });
};

const showDeleteModal = ref(false);

const openDeleteConfirmModal = () => {
  if (selectedRows.value.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }

  showDeleteModal.value = true;
};

const deleteRows = async () => {
  const params = selectedRows.value;

  try {
    if (params.length === 1) {
      await processApi.delete(`/process/${params}`);
    } else {
      await processApi.delete("/process", { data: params });
    }

    window.location.reload();
  } catch (e) {
    alert("삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

const handleUpdateStatus = (id, patch) => {
  const index = fields.value.findIndex((row) => row.id === id);
  if (index !== -1) {
    fields.value[index] = {
      ...fields.value[index],
      ...patch, // status만 변경됨
    };
  }
};
const dateRange = ref([null, null]);
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
          <DropdownMenu v-model="selectedCategory" :options="categories" option-label="name" option-value="value"
            type="radio" :arrowIcon="customArrowIcon" />
          <div class="date-range">
            <DateRangePicker v-model="dateRange" :isRange="true" :enableTime="true" placeholder="날짜 범위 선택"
              class="search-date" />
          </div>
          <div class="Search" v-if="!isDateCategory">
            <Input v-model="keyword" placeholder="검색어를 입력해주세요." class="search-input" />
          </div>
          <Button @click="handleSearch" class="search-button" label="검색" />
        </div>
      </div>
      <div class="fix-table">
        <DataTable ref="dataTableRef" v-model:selected="selectedRows" :columns="columns" :data="fields"
          @update:data="handleUpdateStatus" :extraColumn="extraColumn" :selectable="true" class="fix fixed"
          :clickable="true" @cell-click="goToEditPage" />
        <PaginationsView :totalItems="totalItems" ref="paginationRef" />
      </div>
    </div>
    <Modal :show="showDeleteModal" title="공정 관리 삭제 확인" :message="`${selectedRows.length}개의 항목을 삭제하시겠습니까?`"
      confirmText="확인" cancelText="취소" @confirm="deleteRows" @close="showDeleteModal = false"
      @cancel="showDeleteModal = false" />
  </div>
</template>