<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Title from "@/components/common/Title.vue";
import CardBox from "@/components/common/CardBox.vue";
import Input from "@/components/common/Input.vue";
import Form from "@/components/common/Form.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Button from "@/components/common/Button.vue";
import customArrowIcon from "@/assets/image/icon/chevron-down.svg";
import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";
import upIcon from "@/assets/image/icon/up_icon.svg";
import downIcon from "@/assets/image/icon/down_icon.svg";
import Modal from "@/components/common/Modal.vue";
import PagingView from "@/components/common/PagingView.vue";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


const router = useRouter();




const selectedRows = ref([]);
const totalItems = computed(() => data.value.length);
const dataTableRef = ref(null);
const isTableModalVisible = ref(false);

const fields = ref({
  processName: "",
  processType: "",
  processDetail: "",
});


const processTypes = ref([
  { name: "압연공정", value: "rolling" },
  { name: "프레스", value: "press" },
  { name: "용접", value: "welding" },
  { name: "표면처리", value: "surface" },
]);

const processDetail = ref([
  { name: "냉각압연", value: "cooling" },
  { name: "CCTV", value: "cctv" },
  { name: "소재측정", value: "material" },
  { name: "온도계", value: "temperature" },
  { name: "습도계", value: "humidity" },
]);

const columns = ref([
  { key: "deviceName", label: "장비명", width: "20%", align: "text-center" },
  { key: "kind", label: "종류", width: "10%", align: "text-center" },
  { key: "protocol", label: "프로토콜", width: "17%", align: "text-center" },
  { key: "connectionData", label: "연결정보", width: "20%", align: "text-center" },
  { key: "status", label: "상태", width: "5%", align: "text-center", type: "badge" },
  { key: "cycle", label: "주기(초)", width: "5%", align: "text-center" },
  { key: "changeState", label: "상태변경", width: "10%", align: "text-center", type: "toggle-button" },
]);

// 더미 데이터 (회원 목록)
const data = ref([
  { id: 1, deviceName: "냉각압연_1", kind: "압연", protocol: "OPC-UA", connectionData: "192.168.0.100:8080", status: "진행중", cycle: "5", },
  { id: 2, deviceName: "검사 CCTV", kind: "영상", protocol: "MQTT ", connectionData: "192.168.0.100:8080", status: "중지", cycle: "5", },
  { id: 3, deviceName: "소재측정", kind: "상태", protocol: "PLC", connectionData: "192.168.0.100:8080", status: "진행중", cycle: "5", },
  { id: 4, deviceName: "온도계_지상", kind: "온도", protocol: "MQTT", connectionData: "192.168.0.100:8080", status: "진행중", cycle: "5", },
  { id: 5, deviceName: "습도계", kind: "습도", protocol: "MQTT", connectionData: "192.168.0.100:8080", status: "진행중", cycle: "5", },
]);



const selectedCategory = ref("");
const keyword = ref("");
const categories = ref([
  { name: "장비명", value: "name" },
  { name: "프로토콜", value: "type" },
]);

const dbTableData = ref([
  { id: 1001, name: "로봇암", type: "MQTT", cycle: "3" },
  { id: 1002, name: "센서", type: "OPC-UA", cycle: "2" },
  { id: 1003, name: "압력계", type: "PLC", cycle: "1" },
]);




const moveRowUp = (row) => {
  const index = data.value.findIndex((r) => r.id === row.id);
  if (index > 0) {
    const temp = data.value[index - 1];
    data.value[index - 1] = row;
    data.value[index] = temp;
  }
};

const moveRowDown = (row) => {
  const index = data.value.findIndex((r) => r.id === row.id);
  if (index < data.value.length - 1) {
    const temp = data.value[index + 1];
    data.value[index + 1] = row;
    data.value[index] = temp;
  }
};


const orderColumn = {
  label: "순서변경",
  width: "100px",
  actions: [
    {
      label: "위로",
      imgSrc: upIcon,
      className: "btn-up",
      handler: moveRowUp,
    },
    {
      label: "아래로",
      imgSrc: downIcon,
      className: "btn-down",
      handler: moveRowDown,
    },
  ],
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


const showDeleteModal = ref(false);

const openDeleteConfirmModal = () => {
  if (selectedRows.value.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }
  showDeleteModal.value = true;
};


const handleSearch = () => {
  console.log("검색 실행", selectedCategory.value, keyword.value);
  // 실제 API 또는 필터 로직 넣을 수 있음
};


const handleSelectRow = (row) => {
  const exists = data.value.find(item => item.id === row.id);
  if (exists) {
    alert("이미 추가된 장비입니다.");
    return;
  }

  data.value.push({
    id: row.id,
    deviceName: row.name,
    kind: "-", // 필요시 수정
    protocol: row.type,
    connectionData: "-",
    status: "진행중",
    cycle: row.cycle,
  });

  isTableModalVisible.value = false;
};

const handleRegisterClick = () => {
  // 필수값 검증 로직 추가 가능
  console.log("공정 등록 실행", fields.value, data.value);
  isModalVisible.value = true; // 확인용 모달 띄우기
};


const isRegisterButtonDisabled = computed(() => {
  return !fields.value.processName || !fields.value.processType || !fields.value.processDetail || data.value.length === 0;
});
const isModalVisible = ref(false);

const executeRegistration = () => {
  console.log("공정 등록 확정!");
  isModalVisible.value = false;

  // 리스트 페이지로 이동
  router.push({
    path: "/user/process/",
    query: { registered: "true" },
  });
};
const goBack = () => {
  router.push("/user/process"); // 리스트 페이지로 이동
};

const isCancelModalVisible = ref(false);
const goToEditPage = (row) => {
  console.log("장비 수정 페이지로 이동", row);

};
const confirmDelete = () => {
  const idsToDelete = selectedRows.value.map(row => row.id);
  data.value = data.value.filter(row => !idsToDelete.includes(row.id));
  selectedRows.value = []; // 선택 초기화
  showDeleteModal.value = false;
};
const handleCancelClick = () => {
  if (haveFieldsChanged()) {
    isCancelModalVisible.value = true;
  } else {
    goBack();
  }
};

</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="공정 관리 수정" />
      <CardBox class="card">
        <Form class="add-form">
          <template #default>
            <div class="input-wrap">
              <div class="input-item">
                <p class="tit">공정명</p>
                <Input v-model="fields.processName" placeholder="공정명을 입력하세요" />
              </div>
              <div class="input-item">
                <p class="tit">공정종류</p>
                <DropdownMenu v-model="fields.processType" :options="processTypes" option-label="name"
                  option-value="value" placeholder="공정종류 선택" type="radio" :arrowIcon="customArrowIcon" />
              </div>
              <div class="input-item">
                <p class="tit">공정상세</p>
                <DropdownMenu v-model="fields.processDetail" :options="processDetail" option-label="name"
                  option-value="value" placeholder="공정상세 선택" type="radio" :arrowIcon="customArrowIcon" />
              </div>
            </div>
          </template>
        </Form>
        <div class="add-item">
          <p class="tit">장비목록</p>
          <div class="flex-right">
            <div class="buttons">
              <Button class=" btn-success" @click="isTableModalVisible = true" label="추가" />
              <Button class=" btn-delete" @click="openDeleteConfirmModal" label="삭제" />
            </div>
          </div>
        </div>
        <div class="fix-table">
          <DataTable ref="dataTableRef" v-model:selected="selectedRows" :columns="columns" :data="data"
            :orderColumn="orderColumn" :selectable="true" class="fix fixed" :clickable="true" @cell-click="goToEditPage"
            @update:data="handleUpdateRow" />
          <PaginationsView :totalItems="totalItems" ref="paginationRef" />
        </div>
        <div class="button-group right">
          <div class="buttons right-buttons">
            <Button label="취소" type="primary" class="cancel-btn" @click="handleCancelClick" />
            <Button label="완료" type="primary" @click="handleRegisterClick" class="add-btn"
              :disabled="isRegisterButtonDisabled" />
          </div>
        </div>
      </CardBox>
    </div>




    <Modal :show="showDeleteModal" title="장비삭제" :message="`${selectedRows.length}개의 항목을 삭제하시겠습니까?`" confirmText="확인"
      cancelText="취소" @confirm="confirmDelete" @close="showDeleteModal = false" @cancel="showDeleteModal = false" />

    <Modal :show="isTableModalVisible" title="장비" :showCloseButton="true" :overlayClosable="false" :showCancel="false"
      :showConfirm="false" :showFooter="false" :showButtons="false" class="deviceModal"
      @close="isTableModalVisible = false">
      <template #default>
        <div class="modal-table-container">
          <div class="SearchBar right">
            <div class="SearchFilter">
              <DropdownMenu v-model="selectedCategory" :options="categories" option-label="name" option-value="value"
                placeholder="선택" type="radio" :arrowIcon="customArrowIcon" />
              <div class="Search">
                <Input v-model="keyword" placeholder="검색어를 입력해주세요." class="search-input" />
                <Button :icon="faSearch" @click="handleSearch" class="search-btn" />
              </div>
            </div>
          </div>
          <table class="modal-table">
            <colgroup>
              <col style="width: 25%" />
              <col style="width: 25%" />
              <col style="width: 25%" />
              <col style="width: 25%" />
            </colgroup>
            <thead>
              <tr>
                <th>장비명</th>
                <th>프로토콜</th>
                <th>주기(초)</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dbTableData" :key="row.id">
                <td>{{ row.name }}</td>
                <td>{{ row.type }}</td>
                <td>{{ row.cycle }}</td>
                <td>
                  <Button label="OK" size="small" @click="handleSelectRow(row)" class="choice-btn" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="PagingView">
            <PagingView />
          </div>
        </div>
      </template>
    </Modal>

    <Modal :show="isModalVisible" title="공정추가" message="공정관리를 추가하시겠습니까?" @update:show="isModalVisible = $event"
      @confirm="executeRegistration" @cancel="isModalVisible = false" class="confirmModal" />

    <Modal :show="isCancelModalVisible" title="알림" confirmText="확인" cancelText="취소"
      @update:show="isCancelModalVisible = $event" @confirm="goBack" @cancel="isCancelModalVisible = false"
      class="alertModal">
      <template #default>
        <p>작성중인 내용이 있습니다.</p>
        <p>나가시겠습니까?</p>
      </template>
    </Modal>
  </div>
</template>