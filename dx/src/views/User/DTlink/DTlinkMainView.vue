<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
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
import axios from "axios";
import { CATEGORIES, AI_TYPES } from '@/constants';

onMounted(() => init());

const router = useRouter();

const endpoint1 = ref("http://ai.solution.com/ID (학습)");
const endpoint2 = ref("ws://dt.solution.com/ID");

const aiTypes = ref(AI_TYPES);

const fields = ref([]);

const modalState = reactive({
  confirmDelete: false,
  confirmParameter: false,
});

const searchParams = ref({});

const paginationRef = ref(null);

const init = () => {
  searchParams.value = {
    category: 'name',
    keyword: '',
    page: 1,
    size: paginationRef.value?.perPageOptions[0]
  };

  executeSearch();
};

const categories = ref(CATEGORIES);

const selectedCategory = ref("연계명");

const keyword = ref("");

const currentPage = computed(() => paginationRef.value?.currentPage || []);

const selectedSize = computed(() => paginationRef.value?.selectedPerPage || []);

const handleSearch = () => {
  const category = categories.value.find(opt => opt.name === selectedCategory.value).value;

  searchParams.value = {
    category: category,
    keyword: category === 'type'
      ? aiTypes.value.find(o => o.name === keyword.value)?.value || ''
      : keyword.value,
    page: currentPage.value,
    size: selectedSize.value
  };

  executeSearch();
};

const totalItems = ref(0);

const executeSearch = async () => {
  const { data: { total, apiList } } = await axios.get("http://localhost:8204/api/ai/conn", {
    params: searchParams.value
  });

  totalItems.value = total;

  fields.value = apiList.map(d => ({
    ...d,
    type: aiTypes.value.find(o => o.value === d.type)?.name
  }));
};

watch(
  [() => currentPage.value, () => selectedSize.value],
  ([], [oldPage, oldSize]) => {
    if (!oldPage || oldSize) {
      return;
    }
    handleSearch();
  }
);

const dataTableRef = ref(null);

const selectedRows = computed(() => dataTableRef.value?.selectedRows || []);

const columns = ref([
  { key: "name", label: "연계명", width: "17%", align: "text-center", clickable: true },
  { key: "processType", label: "공정종류", width: "17%", align: "text-center" },
  { key: "processName", label: "공정명", width: "17%", align: "text-center" },
  { key: "endpoint", label: "연계 ID", width: "17%", align: "text-center" },
  { key: "type", label: "AI 종류", width: "17%", align: "text-center" },
  {
    key: "parameter",
    label: "파라미터",
    width: "15%",
    align: "text-center",
    type: "button",
    buttonLabel: "보기",
    className: "btn-view",
    onClick: (row) => {
      router.push({ name: "dtLinkParams", query: { id: row.id } });
    }
  },
]);


const goToEditPage = (row) => {
  router.push({ name: "dtLinkEdit", query: { id: row.id } });
};

const openDeleteConfirmModal = () => {
  if (selectedRows.value.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }

  modalState.confirmDelete = true;
};

const deleteRows = () => {
  const params = selectedRows.value;

  const baseURL = "http://localhost:8204/api/ai/conn";

  let action = ref(null);

  if (params.length == 1) {
    action = () => { return axios.delete(`${baseURL}/${params}`) };
  } else {
    action = () => { return axios.delete(baseURL, { data: params }) };
  }

  action().then(() => { window.location.reload() });
};
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="연계 목록" />
      <CardBox>
        <div class="content">
          <p>연계 endpoint :</p>
          <Input v-model="endpoint1" :is-disabled="true" readonly />
        </div>
        <div class="content">
          <p>연계 endpoint :</p>
          <Input v-model="endpoint2" :is-disabled="true" readonly />
        </div>
      </CardBox>
      <div class="SearchBar right">
        <div class="buttons">
          <Button class=" btn-success" @click="router.push({ name: 'dtLinkAdd' })" label="추가" />
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
        <DataTable ref="dataTableRef" :columns="columns" :data="fields" :selectable="true" class="fix fixed"
          :clickable="true" @cell-click="goToEditPage" />
        <PaginationsView :totalItems="totalItems" ref="paginationRef" />
      </div>
    </div>
    <Modal :show="modalState.confirmDelete" title="연계 삭제 확인" :message="`${selectedRows.length}개의 항목을 삭제하시겠습니까?`"
      confirmText="확인" cancelText="취소" @confirm="deleteRows" @close="modalState.confirmDelete = false"
      @cancel="modalState.confirmDelete = false" />
  </div>
</template>
