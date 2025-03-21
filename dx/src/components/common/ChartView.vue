<script setup>
import { onMounted, watch, ref, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  type: { type: String, default: 'bar' },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
  width: { type: [String, Number] },
  height: { type: [String, Number] },
});

const canvasRef = ref(null);
let chartInstance = null;

const renderChart = async () => {
  await nextTick();
  if (chartInstance) chartInstance.destroy();
  const ctx = canvasRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: props.options,
  });
};

watch(() => props.data, renderChart, { deep: true });
onMounted(renderChart);
</script>

<template>
  <div class="chart-wrapper">
    <canvas ref="canvasRef" />
  </div>
</template>
<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: 50px;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>