<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import DropdownMenu from "@/components/common/DropdownMenu.vue"; // 드롭다운 컴포넌트 임포트

const props = defineProps({
  columns: Array,
  data: {
    type: Array,
    default: () => [],
  },
  extraColumn: {
    type: Object,
    default: () => ({
      getActions: () => [], // 기본적으로 빈 배열 반환하여 안전성 확보
    }),
  },
  orderColumn: Object,
  selectable: Boolean,
});

const emit = defineEmits(["update:data"]);
const selectedRows = ref([]);
const allCheckRef = ref(null);
const router = useRouter();
const isEditingRow = ref(null); // 수정 모드 상태 추가

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
watch([selectedRows, () => props.data], () => {
  if (allCheckRef.value) {
    allCheckRef.value.indeterminate = isIndeterminate.value;
  }
});

// 개별 체크박스 선택 핸들러
const toggleSelection = (row) => {
  if (selectedRows.value.includes(row)) {
    selectedRows.value = selectedRows.value.filter((r) => r !== row);
  } else {
    selectedRows.value.push(row);
  }
  emit("update:selectedRows", selectedRows.value);
};

// 전체 선택 / 해제 핸들러
const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = props.data.map((row) => row.id); // ID를 기준으로 선택
  }
};

// 페이지 이동 함수 (필요한 경우 개별적으로 사용)
const goToDetailPage = (row, columnKey) => {
  console.log(`Navigating to detail page with ID: ${row.id}, Column: ${columnKey}`);

  router.push({
    name: "SolutionEdit",
    query: { id: row.id, column: columnKey },
  });
};

// 데이터 값 업데이트 핸들러 (페이지 이동 제거됨)
const updateDataValue = (row, newValue) => {
  emit("update:data", row.id, newValue); // 부모 컴포넌트에서 데이터 업데이트 처리
  isEditingRow.value = null;
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
          <col v-if="orderColumn" :style="{ width: orderColumn.width || 'auto' }" />
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
            <th v-if="orderColumn">{{ orderColumn.label }}</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-body">
      <table class="table-col">
        <colgroup>
          <col v-if="selectable" style="width: 50px;" />
          <col v-for="col in columns" :key="col.key" :style="{ width: col.width || 'auto' }" />
          <col v-if="extraColumn" :style="{ width: extraColumn.width || 'auto' }" />
          <col v-if="orderColumn" :style="{ width: orderColumn.width || 'auto' }" />
        </colgroup>
        <tbody>
          <tr v-for="row in data" :key="row.id">
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
                  @update:modelValue="(newValue) => updateDataValue(row, newValue)" />
              </template>
              <template v-else>
                <p :class="[{ link: col.clickable }, col.align || '']"
                  @click="col.clickable ? $emit('cell-click', row) : null">
                  {{ row[col.key] || "" }}
                </p>
              </template>
            </td>
            <td v-if="extraColumn">
              <div class="button-list">
                <button
                  v-for="action in (extraColumn.actions || (extraColumn.getActions ? extraColumn.getActions(row) : []))"
                  :key="action.label" @click="() => action.handler(row)" :class="['action-button', action.className]">
                  {{ action.label }}
                </button>
              </div>
            </td>
            <td v-if="orderColumn">
              <div class="button-list">
                <button v-for="action in orderColumn.actions" :key="action.label" @click="() => action.handler(row)"
                  :class="['action-button', action.className]">
                  <img :src="action.imgSrc" alt="action.label" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
