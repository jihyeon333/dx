<script setup>
import { ref, watch } from "vue";
import Title from '@/components/common/Title.vue';
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import DataTable from '@/components/common/DataTable.vue';
import upIcon from "@/assets/image/icon/up_icon.svg";
import downIcon from "@/assets/image/icon/down_icon.svg";
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';

// 탭 상태 관리
const tabs = ['요청 파라미터', '응답 파라미터'];
const activeTab = ref(localStorage.getItem("activeTab") || tabs[0]);  // 기본값 '요청 파라미터'

// 선택된 옵션 (입출력 형식)
const selectedOption = ref("");
const selectedOptions = ["JSON", "TEXT"];


// 순서 변경 핸들러
const moveUp = (row) => {
  const index = data.value.indexOf(row);
  if (index > 0) {
    const temp = data.value[index];
    data.value[index] = data.value[index - 1];
    data.value[index - 1] = temp;
    // 순서 업데이트
    data.value[index].order = index + 1;
    data.value[index - 1].order = index;
  }
};

const moveDown = (row) => {
  const index = data.value.indexOf(row);
  if (index < data.value.length - 1) {
    const temp = data.value[index];
    data.value[index] = data.value[index + 1];
    data.value[index + 1] = temp;
    // 순서 업데이트
    data.value[index].order = index + 1;
    data.value[index + 1].order = index;
  }
};

const extraColumn = {
  label: "삭제/적용",
  width: "20%",
  actions: [
    { label: "삭제", className: "btn-delete", handler: (row) => deleteRow(row) },
    { label: "적용", className: "btn-apply", handler: (row) => apply(row) },
  ]
};

const orderColumn = {
  label: "순서 변경",
  width: "20%",
  actions: [
    {
      label: "위로",
      className: "btn-up",
      handler: (row) => moveUp(row),
      imgSrc: upIcon,
    },
    {
      label: "아래로",
      className: "btn-down",
      handler: (row) => moveDown(row),
      imgSrc: downIcon,
    },
  ]
};

// columns 배열에서는 extraColumn과 orderColumn을 제외한 열만 정의
const columns = ref([
  { key: "name", label: "속성명", width: "20%", align: "text-center" },
  { key: "dataValue", label: "값형식", width: "20%", align: "text-center" },
]);

// 데이터
const data = ref([
  { id: 1, name: "API_KEY", dataValue: "String", order: 1 },
  { id: 2, name: "ID", dataValue: "Number", order: 2 },
  { id: 3, name: "beginDate", dataValue: "Array", order: 3 },
]);

// 선택 가능 여부
const selectable = ref(true);



// dataValue 드롭다운 옵션
const dataValueOption = ref("")
const dataValueOptions = ["String", "Number", "Array"];

// 탭 변경 시 로컬 스토리지에 저장
watch(activeTab, (newTab) => {
  localStorage.setItem("activeTab", newTab);
});

// 데이터 저장 함수
const saveData = () => {
  // 이 부분에서 데이터를 저장할 로직을 추가합니다. 예: 서버로 전송.
  console.log("저장된 데이터:", selectedOption.value, data.value);
  // 예: 서버로 전송하는 코드 추가
  // axios.post('/api/save', { selectedOption: selectedOption.value, data: data.value })
};
</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="파라미터 등록" />
      <section class="top-wrap">
        <div class="tab-container">
          <div class="tabs">
            <button v-for="(tab, index) in tabs" :key="index" :class="[{ tab: true, active: activeTab === tab }]"
              @click="activeTab = tab">
              {{ tab }}
            </button>
          </div>
          <!-- 입출력 형식 선택 드롭다운 -->
          <DropdownMenu v-model="selectedOption" :options="selectedOptions" placeholder="입출력 형식" type="radio"
            :arrowIcon="customArrowIcon" />
        </div>
      </section>

      <!-- 탭에 맞는 내용 표시 -->
      <section>
        <DataTable :columns="columns" :data="data" :extraColumn="extraColumn" :orderColumn="orderColumn"
          :selectable="selectable" class="fixed">
          <template #dataValue="{ row }">
            <!-- dataValue 셀에 드롭다운 메뉴 초기화 -->
            <DropdownMenu v-model="row.dataValue" :options="dataValueOptions" class="dropdown-cell" />
          </template>
        </DataTable>
      </section>

      <!-- 완료 버튼 클릭 시 데이터 저장 -->
      <button @click="saveData">완료</button>
    </div>
  </div>
</template>
