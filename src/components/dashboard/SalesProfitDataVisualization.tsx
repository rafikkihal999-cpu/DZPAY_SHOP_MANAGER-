import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  BarChart3,
  Calendar,
  Clock,
  ArrowUpRight,
  Sparkles,
  PieChart as PieChartIcon,
  Layers,
  ChevronDown,
  Info,
  DollarSign,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

export type TimeframeMode = 'daily' | 'weekly' | 'hourly';
export type ChartStyleMode = 'composed' | 'bars' | 'area';

interface DailyDataPoint {
  period: string;
  dayName: string;
  sales: number; // in DZD
  profit: number; // in DZD
  cost: number; // in DZD
  transactionsCount: number;
}

interface WeeklyDataPoint {
  period: string;
  weekName: string;
  sales: number;
  profit: number;
  cost: number;
  transactionsCount: number;
}

interface HourlyDataPoint {
  period: string;
  hourName: string;
  sales: number;
  profit: number;
  cost: number;
  transactionsCount: number;
}

// Realistic data representing Algerian Mobile & Accessories retail business
const DAILY_SALES_PROFIT_DATA: DailyDataPoint[] = [
  { period: 'السبت', dayName: 'السبت (03 ماي)', sales: 185000, cost: 146000, profit: 39000, transactionsCount: 14 },
  { period: 'الأحد', dayName: 'الأحد (04 ماي)', sales: 142000, cost: 112000, profit: 30000, transactionsCount: 11 },
  { period: 'الإثنين', dayName: 'الإثنين (05 ماي)', sales: 215000, cost: 169000, profit: 46000, transactionsCount: 18 },
  { period: 'الثلاثاء', dayName: 'الثلاثاء (06 ماي)', sales: 198000, cost: 154000, profit: 44000, transactionsCount: 15 },
  { period: 'الأربعاء', dayName: 'الأربعاء (07 ماي)', sales: 268000, cost: 211000, profit: 57000, transactionsCount: 22 },
  { period: 'الخميس', dayName: 'الخميس (08 ماي)', sales: 345000, cost: 272000, profit: 73000, transactionsCount: 29 },
  { period: 'الجمعة', dayName: 'الجمعة (اليوم)', sales: 290000, cost: 228000, profit: 62000, transactionsCount: 24 },
];

const WEEKLY_SALES_PROFIT_DATA: WeeklyDataPoint[] = [
  { period: 'الأسبوع 1', weekName: 'الأسبوع الأول (01 - 07)', sales: 1120000, cost: 885000, profit: 235000, transactionsCount: 89 },
  { period: 'الأسبوع 2', weekName: 'الأسبوع الثاني (08 - 14)', sales: 1480000, cost: 1160000, profit: 320000, transactionsCount: 118 },
  { period: 'الأسبوع 3', weekName: 'الأسبوع الثالث (15 - 21)', sales: 1360000, cost: 1075000, profit: 285000, transactionsCount: 105 },
  { period: 'الأسبوع 4', weekName: 'الأسبوع الرابع (22 - 30)', sales: 1643000, cost: 1292000, profit: 351000, transactionsCount: 132 },
];

const HOURLY_SALES_PROFIT_DATA: HourlyDataPoint[] = [
  { period: '09:00', hourName: '09:00 - 11:00', sales: 32000, cost: 24000, profit: 8000, transactionsCount: 3 },
  { period: '11:00', hourName: '11:00 - 13:00', sales: 58000, cost: 45000, profit: 13000, transactionsCount: 5 },
  { period: '13:00', hourName: '13:00 - 15:00', sales: 24000, cost: 19000, profit: 5000, transactionsCount: 2 },
  { period: '15:00', hourName: '15:00 - 17:00', sales: 64000, cost: 50000, profit: 14000, transactionsCount: 6 },
  { period: '17:00', hourName: '17:00 - 19:00', sales: 115000, cost: 91000, profit: 24000, transactionsCount: 9 },
  { period: '19:00', hourName: '19:00 - 21:00', sales: 88000, cost: 69000, profit: 19000, transactionsCount: 7 },
  { period: '21:00', hourName: '21:00 - 23:00', sales: 42000, cost: 33000, profit: 9000, transactionsCount: 3 },
];

// Profit & revenue by category
const CATEGORY_PROFIT_DATA = [
  { name: 'هواتف ذكية وتابلت', salesPercent: 58, profitPercent: 32, profitDZD: 112000, color: '#0284c7' }, // Sky
  { name: 'إكسسوارات وشواحن', salesPercent: 24, profitPercent: 46, profitDZD: 161000, color: '#10b981' }, // Emerald (highest margin!)
  { name: 'خدمات رقمية وفليكسي', salesPercent: 12, profitPercent: 14, profitDZD: 49000, color: '#f59e0b' }, // Amber
  { name: 'صيانة وقطع غيار', salesPercent: 6, profitPercent: 8, profitDZD: 28000, color: '#8b5cf6' }, // Purple
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  timeframe: TimeframeMode;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const salesItem = payload.find((p) => p.dataKey === 'sales');
    const profitItem = payload.find((p) => p.dataKey === 'profit');
    const costItem = payload.find((p) => p.dataKey === 'cost');

    const salesVal = salesItem ? Number(salesItem.value) : 0;
    const profitVal = profitItem ? Number(profitItem.value) : 0;
    const costVal = costItem ? Number(costItem.value) : 0;
    const margin = salesVal > 0 ? ((profitVal / salesVal) * 100).toFixed(1) : '0';

    return (
      <div className="p-3 bg-white dark:bg-[#0c162e] border border-slate-200 dark:border-sky-900/80 rounded-xl shadow-xl text-xs space-y-2 min-w-[200px] text-right font-sans">
        <div className="font-black text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">{label}</span>
          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            هامش: {margin}%
          </span>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>إجمالي المبيعات:</span>
            </span>
            <span className="font-bold font-mono text-emerald-700 dark:text-emerald-300">
              {salesVal.toLocaleString()} د.ج
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>الربح الصافي:</span>
            </span>
            <span className="font-black font-mono text-sky-700 dark:text-sky-300">
              {profitVal.toLocaleString()} د.ج
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-slate-400 dark:text-slate-500 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
              <span>تكلفة السلع:</span>
            </span>
            <span className="font-mono">{costVal.toLocaleString()} د.ج</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const SalesProfitDataVisualization: React.FC = () => {
  const { isDark } = useTheme();
  const [timeframe, setTimeframe] = useState<TimeframeMode>('daily');
  const [chartStyle, setChartStyle] = useState<ChartStyleMode>('composed');
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState<boolean>(false);

  // Active dataset
  const activeData = useMemo(() => {
    switch (timeframe) {
      case 'weekly':
        return WEEKLY_SALES_PROFIT_DATA;
      case 'hourly':
        return HOURLY_SALES_PROFIT_DATA;
      case 'daily':
      default:
        return DAILY_SALES_PROFIT_DATA;
    }
  }, [timeframe]);

  // Aggregates
  const totals = useMemo(() => {
    const totalSales = activeData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalProfit = activeData.reduce((acc, curr) => acc + curr.profit, 0);
    const totalCost = activeData.reduce((acc, curr) => acc + curr.cost, 0);
    const totalTransactions = activeData.reduce((acc, curr) => acc + curr.transactionsCount, 0);
    const avgMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';
    const avgTransaction = totalTransactions > 0 ? Math.round(totalSales / totalTransactions) : 0;

    // Peak period
    const peak = [...activeData].sort((a, b) => b.sales - a.sales)[0];

    return {
      totalSales,
      totalProfit,
      totalCost,
      totalTransactions,
      avgMargin,
      avgTransaction,
      peakPeriod: peak ? peak.period : '',
      peakSales: peak ? peak.sales : 0,
    };
  }, [activeData]);

  // Colors for dark & light mode
  const gridStroke = isDark ? '#1e2f54' : '#e2e8f0';
  const axisStroke = isDark ? '#64748b' : '#94a3b8';

  return (
    <div
      id="sales-profit-data-visualization"
      className="bg-white dark:bg-[#0b1428] rounded-2xl border border-slate-200 dark:border-[#1c2c4f] shadow-xs overflow-hidden transition-colors"
    >
      {/* Top Header & Interactive Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1c2c4f] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#0e1933]/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>إحصائيات المبيعات والأرباح</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Recharts Analytics
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                تحليل بياني تفاعلي للمبيعات اليومية والأسبوعية، هوامش الربح، وتوزيع الإيرادات بالدينار الجزائري (د.ج)
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Chart Type Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector (Daily / Weekly / Hourly) */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-[#132247] border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
            <button
              type="button"
              id="chart-tab-daily"
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                timeframe === 'daily'
                  ? 'bg-white dark:bg-emerald-700 text-emerald-700 dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>يومي (7 أيام)</span>
            </button>
            <button
              type="button"
              id="chart-tab-weekly"
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                timeframe === 'weekly'
                  ? 'bg-white dark:bg-emerald-700 text-emerald-700 dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>أسبوعي (شهري)</span>
            </button>
            <button
              type="button"
              id="chart-tab-hourly"
              onClick={() => setTimeframe('hourly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                timeframe === 'hourly'
                  ? 'bg-white dark:bg-emerald-700 text-emerald-700 dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ساعات اليوم</span>
            </button>
          </div>

          {/* Chart Style Switcher */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-[#132247] border border-slate-200 dark:border-slate-700/80 text-xs">
            <button
              type="button"
              id="chart-style-composed"
              onClick={() => setChartStyle('composed')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'composed'
                  ? 'bg-white dark:bg-sky-600 text-sky-700 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="رسم بياني مركب (أعمدة + مساحة)"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              id="chart-style-bars"
              onClick={() => setChartStyle('bars')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'bars'
                  ? 'bg-white dark:bg-sky-600 text-sky-700 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="رسم بياني شريطي مقارن"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              id="chart-style-area"
              onClick={() => setChartStyle('area')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'area'
                  ? 'bg-white dark:bg-sky-600 text-sky-700 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="منحنى مساحي ناعم"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category breakdown toggle button */}
          <button
            type="button"
            id="chart-toggle-categories-btn"
            onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showCategoryBreakdown
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-300 shadow-2xs'
                : 'bg-white dark:bg-[#132247] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>توزيع الفئات</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights for the selected timeframe */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5 border-b border-slate-100 dark:border-[#18274a] bg-white dark:bg-[#0b1428]">
        {/* KPI 1: Total Sales */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0f1d3c] border border-slate-200/80 dark:border-[#1e305e] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              إجمالي المبيعات ({timeframe === 'weekly' ? 'الشهر' : timeframe === 'hourly' ? 'اليوم' : '7 أيام'})
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
              {totals.totalSales.toLocaleString()} <span className="text-xs font-sans">د.ج</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span>عدد الفواتير:</span>
              <strong className="font-mono text-slate-700 dark:text-slate-300">{totals.totalTransactions}</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Total Net Profit */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0f1d3c] border border-slate-200/80 dark:border-[#1e305e] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              صافي الأرباح المحققة
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-sky-700 dark:text-sky-400 mt-0.5">
              {totals.totalProfit.toLocaleString()} <span className="text-xs font-sans">د.ج</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span>التكلفة:</span>
              <strong className="font-mono text-slate-700 dark:text-slate-300">{totals.totalCost.toLocaleString()} د.ج</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Average Profit Margin */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0f1d3c] border border-slate-200/80 dark:border-[#1e305e] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              متوسط هامش الربح
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-indigo-700 dark:text-indigo-400 mt-0.5">
              {totals.avgMargin}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span>متوسط السلة:</span>
              <strong className="font-mono text-slate-700 dark:text-slate-300">{totals.avgTransaction.toLocaleString()} د.ج</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Peak Activity Period */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0f1d3c] border border-slate-200/80 dark:border-[#1e305e] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              ذروة النشاط ({timeframe === 'weekly' ? 'أفضل أسبوع' : timeframe === 'hourly' ? 'ذروة الساعات' : 'أفضل يوم'})
            </span>
            <div className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-400 mt-0.5 truncate">
              {totals.peakPeriod}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span>مبيعات الذروة:</span>
              <strong className="font-mono text-slate-700 dark:text-slate-300">{totals.peakSales.toLocaleString()} د.ج</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className={`p-4 sm:p-5 ${showCategoryBreakdown ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}`}>
        {/* Main Chart Area */}
        <div className={showCategoryBreakdown ? 'lg:col-span-2' : 'w-full'}>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                مقارنة الإيرادات والأرباح بالدينار الجزائري (DZD)
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block" />
                <span>المبيعات</span>
              </div>
              <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
                <span className="w-3 h-3 rounded-md bg-sky-500 inline-block" />
                <span>الربح الصافي</span>
              </div>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="w-full h-[320px] sm:h-[350px] pt-2" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              {chartStyle === 'bars' ? (
                <BarChart
                  data={activeData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="period"
                    stroke={axisStroke}
                    tick={{ fill: axisStroke, fontSize: 12, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    stroke={axisStroke}
                    tick={{ fill: axisStroke, fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    dx={-6}
                  />
                  <Tooltip
                    content={<CustomChartTooltip timeframe={timeframe} />}
                  />
                  <Bar
                    dataKey="sales"
                    name="المبيعات"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                  <Bar
                    dataKey="profit"
                    name="الربح الصافي"
                    fill="#0284c7"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              ) : chartStyle === 'area' ? (
                <AreaChart
                  data={activeData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
                >
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="period"
                    stroke={axisStroke}
                    tick={{ fill: axisStroke, fontSize: 12, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    stroke={axisStroke}
                    tick={{ fill: axisStroke, fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    dx={-6}
                  />
                  <Tooltip
                    content={<CustomChartTooltip timeframe={timeframe} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="المبيعات"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="الربح الصافي"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#profitGrad)"
                  />
                </AreaChart>
              ) : (
                /* Composed Chart: Bar for Sales, Smooth Line & Area for Net Profit */
                <ComposedChart
                  data={activeData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
                >
                  <defs>
                    <linearGradient id="profitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="period"
                    stroke={axisStroke}
                    tick={{ fill: axisStroke, fontSize: 12, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    stroke={axisStroke}
                    tick={{ fill: axisStroke, fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    dx={-6}
                  />
                  <Tooltip
                    content={<CustomChartTooltip timeframe={timeframe} />}
                  />
                  <Bar
                    dataKey="sales"
                    name="المبيعات"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="الربح الصافي"
                    fill="url(#profitAreaGrad)"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, stroke: '#0284c7', strokeWidth: 2 }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Panel (Donut Chart) */}
        {showCategoryBreakdown && (
          <div className="border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-[#1c2c4f] lg:pr-6 pt-4 lg:pt-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <PieChartIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span>توزيع الأرباح حسب الأصناف</span>
                </h3>
                <span className="text-[10px] text-slate-400">حسب الهامش</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                تُظهر البيانات أن فئة <strong className="text-emerald-700 dark:text-emerald-400 font-bold">الإكسسوارات والشواحن</strong> تحقق أعلى نسبة ربح صافية للمحل مقارنة بالهواتف.
              </p>

              {/* Donut Pie Chart */}
              <div className="h-44 w-full flex items-center justify-center relative" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_PROFIT_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="profitPercent"
                    >
                      {CATEGORY_PROFIT_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#0b1428' : '#fff'} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any, item: any) => [
                        `${val}% (${item.payload.profitDZD.toLocaleString()} د.ج)`,
                        'نسبة مساهمة الربح',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] text-slate-400 font-bold">أعلى ربح</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">46%</span>
                  <span className="text-[9px] text-slate-500">إكسسوارات</span>
                </div>
              </div>

              {/* Category Legend List */}
              <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {CATEGORY_PROFIT_DATA.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono font-bold flex items-center gap-2">
                      <span className="text-slate-500">{cat.profitPercent}%</span>
                      <span className="text-slate-900 dark:text-slate-200">{cat.profitDZD.toLocaleString()} د.ج</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                نصيحة مالية: التركيز على بيع ملحقات الحماية (Anti-choc) والشواحن الأصلية يرفع العائد الربحي الصافي بنسبة تصل لـ 45%.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Notes & Insights */}
      <div className="px-4 py-3 bg-slate-50/70 dark:bg-[#0e1933]/70 border-t border-slate-200 dark:border-[#1c2c4f] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            يتم تحديث الرسوم البيانية تلقائياً فور تسجيل مبيعات جديدة في نقطة البيع (POS) أو إدخال فواتير الشراء.
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          DZPAY Analytics Engine • Recharts v2.15
        </div>
      </div>
    </div>
  );
};
