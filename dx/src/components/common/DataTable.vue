<script setup>
import { ref, computed, watch } from "vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue"; // 드롭다운 컴포넌트 임포트

const props = defineProps({
  columns: Array,
  data: Array,
  extraColumn: Object,
  orderColumn: Object, // 추가된 부분
  selectable: Boolean,
});

const selectedRows = ref([]);
const allCheckRef = ref(null);

// 데이터가 없는지 확인
const isEmpty = computed(() => props.data.length === 0);

// 전체 선택 여부
const allSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length;
});

// 일부만 선택되었을 때 'indeterminate' 상태를 만들기 위한 계산
const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length;
});

// 'indeterminate' 상태를 체크박스에 반영
watch([selectedRows, props.data], () => {
  if (allCheckRef.value) {
    allCheckRef.value.indeterminate = isIndeterminate.value;
  }
});

// 개별 체크박스 선택 핸들러
const toggleSelection = (id) => {
  if (!id) return;
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter((rowId) => rowId !== id);
  } else {
    selectedRows.value.push(id);
  }
};

// 전체 선택 / 해제 핸들러
const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = props.data.map((row) => row.id); // ID를 기준으로 선택
  }
};

// 드롭다운에서 선택한 값을 dataValue로 설정하는 함수
const updateDataValue = (row, newValue) => {
  row.dataValue = newValue; // 해당 행의 dataValue를 수정
};

defineExpose({
  selectedRows,
});
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <table class="table-col">
        <colgroup>
          <col v-if="selectable" style="width: 50px;" />
          <col v-for="col in columns" :key="col.key" :style="{ width: col.width || 'auto' }" />
          <col v-if="extraColumn" :style="{ width: extraColumn.width || 'auto' }" />
          <col v-if="orderColumn" :style="{ width: orderColumn.width || 'auto' }" /> <!-- 추가된 부분 -->
        </colgroup>
        <thead>
          <tr>
            <th v-if="selectable">
              <div class="checkbox-container">
                <input id="allcheck" type="checkbox" class="checknum" ref="allCheckRef" @change="toggleAll"
                  :checked="allSelected" :indeterminate="isIndeterminate" />
                <label for="allcheck" class="checkmark"></label>
              </div>
            </th>
            <th v-for="col in columns" :key="col.key">
              {{ col.label }}
            </th>
            <th v-if="extraColumn">{{ extraColumn.label }}</th>
            <th v-if="orderColumn">{{ orderColumn.label }}</th> <!-- 추가된 부분 -->
          </tr>
        </thead>
      </table>
    </div>

    <!-- 데이터가 없을 경우 "내용 없음" 메시지 표시 -->
    <div v-if="isEmpty" class="non-content">
      <i class="ico"></i>
      <span>내용이 없습니다.</span>
    </div>

    <!-- 데이터가 있을 경우 테이블 렌더링 -->
    <div v-else class="table-body">
      <table class="table-col">
        <colgroup>
          <col v-if="selectable" style="width: 50px;" />
          <col v-for="col in columns" :key="col.key" :style="{ width: col.width || 'auto' }" />
          <col v-if="extraColumn" :style="{ width: extraColumn.width || 'auto' }" />
          <col v-if="orderColumn" :style="{ width: orderColumn.width || 'auto' }" />
        </colgroup>
        <tbody>
          <tr v-for="(row) in data" :key="row.id">
            <td v-if="selectable">
              <div class="checkbox-container">
                <input :id="'check-' + row.id" type="checkbox" class="unitcheck checknum"
                  :checked="selectedRows.includes(row.id)" @change="toggleSelection(row.id)" />
                <label :for="'check-' + row.id" class="checkmark"></label>
              </div>
            </td>
            <td v-for="col in columns" :key="col.key">
              <!-- dataValue 칼럼에 드롭다운 추가 -->
              <template v-if="col.key === 'dataValue'">
                <p :class="col.align || ''" @click="isEditingRow = row">
                  {{ row[col.key] }}
                </p>
                <DropdownMenu v-if="isEditingRow === row" v-model="row[col.key]" :options="['JSON', 'TEXT']"
                  @change="updateDataValue(row, row[col.key])" />
              </template>
              <template v-else>
                <p :class="col.align || ''">{{ row[col.key] || "" }}</p>
              </template>
            </td>
            <td v-if="extraColumn">
              <div class="button-list">
                <button v-for="action in extraColumn.actions" :key="action.label" @click="() => action.handler(row)"
                  :class="['action-button', action.className]">
                  {{ action.label }}
                </button>
              </div>
            </td>
            <td v-if="orderColumn">
              <div class="button-list">
                <button v-for="action in orderColumn.actions" :key="action.label" @click="() => action.handler(row)"
                  :class="['action-button', action.className]">
                  <img :src="action.imgSrc" alt="action.label" /> <!-- 이미지 표시 -->
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
