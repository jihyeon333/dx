<script setup>
import { ref, computed } from "vue";
import Title from '@/components/common/Title.vue';
import DropdownMenu from '@/components/common/DropdownMenu.vue';
import customArrowIcon from '@/assets/image/icon/chevron-down.svg';
import DateRangePicker from '@/components/common/DateRangePicker.vue';
import Button from "@/components/common/Button.vue";
import ChartView from '@/components/common/ChartView.vue';
import DataTable from "@/components/common/DataTable.vue";
import PaginationsView from "@/components/common/PaginationsView.vue";

// 탭 & 필터
const tabs = ref([
  { name: "사용횟수", value: "tab1" },
  { name: "사용량", value: "tab2" },
  { name: "사용상세정보", value: "tab3" },
]);

const categories = ref([
  { name: "전체", value: "all" },
  { name: "회사별", value: "company" },
  { name: "개인별", value: "person" },
]);

const activeTab = ref(tabs.value[0].value);
const isActive = (tab) => activeTab.value === tab.value;


// 필터 및 검색 상태
const selectedFilter = ref("전체");
const searchQuery = ref("");




// 유틸: 공통 옵션 복사 후 병합
const cloneOptions = (customTicks) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        offset: true,
        min: 0,
        ticks: {
          padding: 3,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: false,
        },
        beginAtZero: true,
        min: customTicks.min,
        max: customTicks.max,
        ticks: {
          stepSize: customTicks.stepSize,
        },
      },
    },
  };
};



// 날짜 범위
const dateRange = ref([]);
const isDateRangeFilled = computed(() => {
  return dateRange.value.length === 2 && dateRange.value[0] && dateRange.value[1]
});

// Y축
const dailyLineOptions = cloneOptions({ stepSize: 10, min: 0, max: 30 });
const weeklyLineOptions = cloneOptions({ stepSize: 50, min: 0, max: 100 });
const monthlyLineOptions = cloneOptions({ stepSize: 200, min: 0, max: 600 });
const yearlyLineOptions = cloneOptions({ stepSize: 500, min: 0, max: 500 });




// 일별
const dailyLineData = {
  labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '30'],
  datasets: [
    {
      label: '일별 사용량',
      data: [10, 15, 20, 18, 25, 30, 22, 10, 15, 20, 18, 25, 30, 22, 12],
      borderColor: '#2563EB',
      backgroundColor: 'transparent ',
      fill: true,
      tension: 0.4,
    },
  ],
};

// 주별
const weeklyLineData = {
  labels: ['1주차', '2주차', '3주차', '4주차'],
  datasets: [
    {
      label: '주별 사용량',
      data: [70, 60, 30, 80],
      borderColor: '#2563EB',
      backgroundColor: 'transparent',
      fill: true,
      tension: 0.4,
    },
  ],
};

// 월별
const monthlyLineData = {
  labels: ['1월', '2월', '3월', '4월'],
  datasets: [
    {
      label: '월별 사용량',
      data: [80, 120, 50, 70],
      borderColor: '#2563EB',
      backgroundColor: 'transparent',
      fill: true,
      tension: 0.4,
    },
  ],
};

// 년별
const yearlyLineData = {
  labels: ['2021년', '2022년', '2023년', '2024년'],
  datasets: [
    {
      label: '연도별 사용량',
      data: [200, 230, 240, 250,],
      borderColor: '#2563EB',
      backgroundColor: 'transparent',
      fill: true,
      tension: 0.4,
    },
  ],
};


// 테이블 컬럼 정의
const columnsUseage = ref([
  { key: "data", label: "사용일시", width: "25%", align: "text-center" },
  { key: "count", label: "사용회수", width: "25%", align: "text-center" },
  { key: "usage", label: "사용량(MB)", width: "25%", align: "text-center" },
  { key: "type", label: "회원형태", width: "25%", align: "text-center" },
]);

const dataUseage = ref([
  { id: 1, data: '2025-03-20 14:00', count: 3, usage: 15, type: '솔루션' },
  { id: 2, data: '2025-03-20 15:00', count: 1, usage: 5, type: 'DT' },
  { id: 3, data: '2025-03-21 09:00', count: 2, usage: 8, type: 'DT' },
]);


</script>

<template>
  <div class="contain">
    <div class="contents-wrap">
      <Title text="사용정보" />

      <section class="top-wrap">
        <!-- 탭 -->
        <div class="tab-container">
          <div class="tabs">
            <button v-for="(tab, index) in tabs" :key="index" type="button" :class="[
              'tab',
              { active: isActive(tab) },
              { 'rounded-left': isActive(tab) && index === 0 },
              { 'rounded-right': isActive(tab) && index === tabs.length - 1 }
            ]" @click="activeTab = tab.value">
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- 검색 필터 -->
        <div class="SearchBar right">
          <div class="SearchFilter">
            <DropdownMenu v-model="selectedFilter" :options="categories.map(cat => cat.name)" placeholder="필터를 선택하세요"
              type="radio" :arrowIcon="customArrowIcon" />
          </div>
          <div class="date-range">
            <DateRangePicker v-model="dateRange" placeholder="날짜 범위 선택" class="search-date" />
          </div>
          <Button label="검색" class="search-btn" />
        </div>
      </section>
    </div>

    <!-- 콘텐츠 -->
    <section class="tab-contents">
      <div v-if="activeTab === 'tab1'" class="tab-content">
        <div class="usage-wrap">
          <div class="row">
            <!-- 첫 번째 차트: 일별사용 -->
            <div class="usage daily">
              <div class="chart-title">
                <span>일별</span>
              </div>
              <ChartView :type="'line'" :data="dailyLineData" :options="dailyLineOptions" />
            </div>
            <!-- 두 번째 차트: 주별 -->
            <div class="usage weekly">
              <div class="chart-title">
                <span>주별</span>
              </div>
              <ChartView :type="'line'" :data="weeklyLineData" :options="weeklyLineOptions" />
            </div>
          </div>
          <div class="row">
            <!-- 첫 번째 차트: 월별사용 -->
            <div class="usage monthly">
              <div class="chart-title">
                <span>월별</span>
              </div>
              <ChartView :type="'line'" :data="monthlyLineData" :options="monthlyLineOptions" />
            </div>
            <!-- 두 번째 차트: 년별 -->
            <div class="usage yearly">
              <div class="chart-title">
                <span>년별</span>
              </div>
              <ChartView :type="'line'" :data="yearlyLineData" :options="yearlyLineOptions" />
            </div>
          </div>

        </div>
      </div>
      <div v-if="activeTab === 'tab2'" class="tab-content">
        <div class="usage-wrap">
          <div class="row">
            <!-- 첫 번째 차트: 일별사용 -->
            <div class="usage daily">
              <div class="chart-title">
                <span>일별</span>
              </div>
              <ChartView :type="'line'" :data="dailyLineData" :options="dailyLineOptions" />
            </div>
            <!-- 두 번째 차트: 주별 -->
            <div class="usage weekly">
              <div class="chart-title">
                <span>주별</span>
              </div>
              <ChartView :type="'line'" :data="weeklyLineData" :options="weeklyLineOptions" />
            </div>
          </div>
          <div class="row">
            <!-- 첫 번째 차트: 월별사용 -->
            <div class="usage monthly">
              <div class="chart-title">
                <span>월별</span>
              </div>
              <ChartView :type="'line'" :data="monthlyLineData" :options="monthlyLineOptions" />
            </div>
            <!-- 두 번째 차트: 년별 -->
            <div class="usage yearly">
              <div class="chart-title">
                <span>년별</span>
              </div>
              <ChartView :type="'line'" :data="yearlyLineData" :options="yearlyLineOptions" />
            </div>
          </div>

        </div>
      </div>
      <div v-if="activeTab === 'tab3'" class="tab-content">
        <div class="fix-table">
          <DataTable ref="tableUseage" :columns="columnsUseage" :data="dataUseage" class="fix fixed" />
          <PaginationsView />
        </div>
      </div>
    </section>
  </div>
</template>
