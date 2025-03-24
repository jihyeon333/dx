<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import DropdownMenu from "@/components/common/DropdownMenu.vue";

const props = defineProps({
  columns: Array,
  data: {
    type: Array,
    default: () => [],
  },
  extraColumn: {
    type: Object,
    default: () => ({
      getActions: () => [],
    }),
  },
  orderColumn: Object,
  selectable: Boolean,
  selected: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:data", "update:selected"]);
const selectedRows = ref([]);
const allCheckRef = ref(null);
const router = useRouter();
const isEditingRow = ref(null);

const isEmpty = computed(() => props.data.length === 0);

const allSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length;
});

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length;
});

watch(() => props.selected, (val) => {
  selectedRows.value = [...val];
}, { immediate: true });


const toggleSelection = (rowId) => {
  if (selectedRows.value.includes(rowId)) {
    selectedRows.value = selectedRows.value.filter((id) => id !== rowId);
  } else {
    selectedRows.value.push(rowId);
  }
  emit("update:selected", selectedRows.value);
};


const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = props.data.map((row) => row.id);
  }
  emit("update:selected", selectedRows.value);
};

const goToDetailPage = (row, columnKey) => {
  router.push({
    name: "SolutionEdit",
    query: { id: row.id, column: columnKey },
  });
};

const updateDataValue = (row, newValue) => {
  emit("update:data", row.id, newValue);
  isEditingRow.value = null;
};

const getStatusClass = (status) => {
  switch (status) {
    case "진행중":
      return "status-active";
    case "중지":
      return "status-paused";
    default:
      return "status-default";
  }
};

const toggleStatus = (row) => {
  const newStatus = row.status === "진행중" ? "중지" : "진행중";
  emit("update:data", row.id, { status: newStatus });
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
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
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
              <!-- type: badge -->
              <template v-if="col.type === 'badge'">
                <span :class="['status-badge', getStatusClass(row[col.key])]">
                  {{ row[col.key] }}
                </span>
              </template>

              <!-- type: toggle-button -->
              <template v-else-if="col.type === 'toggle-button'">
                <button :class="[
                  'state-btn',
                  row.status === '진행중' ? 'btn-stop' : 'btn-start'
                ]" @click.stop="toggleStatus(row)">
                  {{ row.status === '진행중' ? '중지' : '시작' }}
                </button>

              </template>

              <!-- type: dropdown -->
              <template v-else-if="col.type === 'dropdown'">
                <p :class="col.align || ''" @click="isEditingRow = row">
                  {{ row[col.key] }}
                </p>
                <DropdownMenu v-if="isEditingRow === row" v-model="row[col.key]" :options="['JSON', 'TEXT']"
                  @update:modelValue="(val) => updateDataValue(row, val)" />
              </template>

              <!-- 기본 버튼  -->
              <template v-else-if="col.type === 'button'">
                <button :class="['table-btn', col.className]" @click.stop="col.onClick?.(row)">
                  {{ col.buttonLabel || '버튼' }}
                </button>
              </template>


              <!-- 기본 렌더링 -->
              <template v-else>
                <p :class="[{ link: col.clickable }, col.align || '']"
                  @click="col.clickable ? $emit('cell-click', row) : null">
                  {{ row[col.key] || "" }}
                </p>
              </template>
            </td>

            <!-- Extra 버튼 컬럼 -->
            <td v-if="extraColumn">
              <div class="button-list">
                <button
                  v-for="action in (extraColumn.actions || (extraColumn.getActions ? extraColumn.getActions(row) : []))"
                  :key="action.label" @click="() => action.handler(row)" :class="['action-button', action.className]">
                  {{ action.label }}
                </button>
              </div>
            </td>

            <!-- Order 버튼 컬럼 -->
            <td v-if="orderColumn">
              <div class="button-list">
                <button v-for="action in orderColumn.actions" :key="action.label" @click="() => action.handler(row)"
                  :class="['action-button', action.className]"
                  :disabled="(action.label === '위로' && data[0]?.id === row.id) || (action.label === '아래로' && data[data.length - 1]?.id === row.id)">
                  <img :src="action.imgSrc" :alt="action.label" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
