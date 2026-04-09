export type TaskStatus = 'GLOBAL_LIST' | 'DAILY_LIST' | 'ACTIVE' | 'COMPLETED';

export type CategoryId = 'work' | 'education' | 'hobby' | 'sport' | 'other';

export type Priority = 'urgent' | 'high' | 'middle' | 'low';

export interface TaskDate {
  fullDeadline: number;
  month: string;
  day: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  categoryId: CategoryId;
  priority: Priority;
  estimation: number;
  deadline: string;
  createDate: TaskDate;
  deadlineDate: TaskDate;
  completedCount: number[];
  failedPomodoros: number[];
  completeDate: string | null;
}

export interface PomodoroSetting {
  value: number;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface PomodoroSettings {
  work: PomodoroSetting;
  shortBreak: PomodoroSetting;
  longBreak: PomodoroSetting;
  iteration: PomodoroSetting;
}

export interface CycleTime {
  full: number;
  hours: number;
  minutes: number;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  text: string;
  duration?: number;
}

export type ReportPeriod = 'day' | 'week' | 'month';
export type ReportCategory = 'pomodoros' | 'tasks';

export interface ReportDataPoint {
  date: string;
  urgent: number;
  high: number;
  middle: number;
  low: number;
  failed: number;
}

export const CATEGORIES: CategoryId[] = ['work', 'education', 'hobby', 'sport', 'other'];

export const CATEGORY_COLORS: Record<CategoryId, string> = {
  work: '#FFB202',
  education: '#59ABE3',
  hobby: '#B470D0',
  sport: '#E16C65',
  other: '#00D4D9',
};

export const PRIORITY_COLORS: Record<Priority | 'failed', string> = {
  urgent: '#F75C4C',
  high: '#FFA841',
  middle: '#FDDC43',
  low: '#1ABC9C',
  failed: '#8DA5B8',
};
