// Custom ECharts configuration with only needed components for tree-shaking
// This reduces bundle size from ~1.1MB to ~300KB

import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import {
	GridComponent,
	TooltipComponent,
	LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register only the components we need
echarts.use([
	LineChart,
	BarChart,
	PieChart,
	GridComponent,
	TooltipComponent,
	LegendComponent,
	CanvasRenderer,
]);

export default echarts;
