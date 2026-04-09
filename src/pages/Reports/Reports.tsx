import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTasks } from '@/hooks/useTasks';
import type { ReportPeriod, ReportCategory, ReportDataPoint, Task } from '@/types';
import { PRIORITY_COLORS } from '@/types';
import { formatDate, parseDate, getWeekDays, getMonthDays, getWeekDayByDate, getMonthDayIndex } from '@/utils/helpers';
import styles from './Reports.module.css';

const MS_PER_DAY = 86400000;

export function Reports() {
  const navigate = useNavigate();
  const { period = 'day', category = 'pomodoros' } = useParams<{
    period: ReportPeriod;
    category: ReportCategory;
  }>();
  const { tasks, loading } = useTasks();

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === 'COMPLETED' && t.completeDate),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const periodDays = period === 'day' ? 1 : period === 'week' ? 7 : 30;

    if (periodDays === 1) {
      const today = formatDate();
      return completedTasks.filter((t) => t.completeDate === today);
    }

    const cutoff = now.getTime() - periodDays * MS_PER_DAY;
    return completedTasks.filter((t) => {
      const d = parseDate(t.completeDate!);
      return d && d.getTime() > cutoff;
    });
  }, [completedTasks, period]);

  const chartData = useMemo(() => {
    if (category === 'pomodoros') {
      return buildPomodorosData(filteredTasks, period as ReportPeriod);
    }
    return buildTasksData(filteredTasks, period as ReportPeriod);
  }, [filteredTasks, category, period]);

  if (loading) {
    return <div className={styles.loading}>Loading reports...</div>;
  }

  return (
    <div className={styles.page}>
      {/* Period Tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Report period">
        {(['day', 'week', 'month'] as ReportPeriod[]).map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={period === p}
            className={`${styles.tab} ${period === p ? styles.activeTab : ''}`}
            onClick={() => navigate(`/reports/${p}/${category}`)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Report category">
        {(['pomodoros', 'tasks'] as ReportCategory[]).map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            className={`${styles.tab} ${category === c ? styles.activeTab : ''}`}
            onClick={() => navigate(`/reports/${period}/${c}`)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className={styles.chartContainer} role="img" aria-label={`${period} ${category} report chart`}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-secondary)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--text-primary)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--text-primary)' }}
              />
              <YAxis
                tick={{ fill: 'var(--text-primary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--text-primary)' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: 4,
                  color: 'var(--text-primary)',
                }}
              />
              <Legend
                wrapperStyle={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  textTransform: 'capitalize',
                }}
              />
              <Bar dataKey="urgent" stackId="a" fill={PRIORITY_COLORS.urgent} />
              <Bar dataKey="high" stackId="a" fill={PRIORITY_COLORS.high} />
              <Bar dataKey="middle" stackId="a" fill={PRIORITY_COLORS.middle} />
              <Bar dataKey="low" stackId="a" fill={PRIORITY_COLORS.low} />
              <Bar dataKey="failed" fill={PRIORITY_COLORS.failed} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.noData}>
            <p>No data for this period</p>
          </div>
        )}
      </div>

      {/* Data Table */}
      {chartData.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{period === 'day' ? 'Priority' : 'Date'}</th>
                <th>Urgent</th>
                <th>High</th>
                <th>Middle</th>
                <th>Low</th>
                <th>Failed</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.urgent}</td>
                  <td>{row.high}</td>
                  <td>{row.middle}</td>
                  <td>{row.low}</td>
                  <td>{row.failed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface ChartRow {
  name: string;
  urgent: number;
  high: number;
  middle: number;
  low: number;
  failed: number;
}

function buildPomodorosData(tasks: Task[], period: ReportPeriod): ChartRow[] {
  if (period === 'day') {
    const totals: ReportDataPoint = {
      date: '',
      urgent: 0,
      high: 0,
      middle: 0,
      low: 0,
      failed: 0,
    };

    tasks.forEach((t) => {
      if (t.completedCount) totals[t.priority] += t.completedCount.length;
      if (t.failedPomodoros) totals.failed += t.failedPomodoros.length;
    });

    return [
      { name: 'urgent', ...totals },
    ];
  }

  const grouped = groupByDate(tasks);
  const categories = period === 'week' ? getWeekDays() : getMonthDays().map(String);

  return categories.map((cat) => {
    const row: ChartRow = { name: cat, urgent: 0, high: 0, middle: 0, low: 0, failed: 0 };
    Object.entries(grouped).forEach(([dateStr, dateTasks]) => {
      const label =
        period === 'week' ? getWeekDayByDate(dateStr) : String(getMonthDayIndex(dateStr));
      if (label === cat) {
        dateTasks.forEach((t) => {
          if (t.completedCount) row[t.priority] += t.completedCount.length;
          if (t.failedPomodoros) row.failed += t.failedPomodoros.length;
        });
      }
    });
    return row;
  });
}

function buildTasksData(tasks: Task[], period: ReportPeriod): ChartRow[] {
  if (period === 'day') {
    const totals: ChartRow = { name: 'Today', urgent: 0, high: 0, middle: 0, low: 0, failed: 0 };
    tasks.forEach((t) => {
      const success = (t.completedCount?.length ?? 0) >= (t.failedPomodoros?.length ?? 0);
      if (success) {
        totals[t.priority]++;
      } else {
        totals.failed++;
      }
    });
    return [totals];
  }

  const grouped = groupByDate(tasks);
  const categories = period === 'week' ? getWeekDays() : getMonthDays().map(String);

  return categories.map((cat) => {
    const row: ChartRow = { name: cat, urgent: 0, high: 0, middle: 0, low: 0, failed: 0 };
    Object.entries(grouped).forEach(([dateStr, dateTasks]) => {
      const label =
        period === 'week' ? getWeekDayByDate(dateStr) : String(getMonthDayIndex(dateStr));
      if (label === cat) {
        dateTasks.forEach((t) => {
          const success = (t.completedCount?.length ?? 0) >= (t.failedPomodoros?.length ?? 0);
          if (success) {
            row[t.priority]++;
          } else {
            row.failed++;
          }
        });
      }
    });
    return row;
  });
}

function groupByDate(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {};
  tasks.forEach((t) => {
    const key = t.completeDate!;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
}
