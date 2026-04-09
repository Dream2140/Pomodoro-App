import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useNotification } from '@/context/NotificationContext';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/types';
import { CATEGORY_COLORS } from '@/types';
import styles from './Timer.module.css';

type TimerPhase = 'idle' | 'work' | 'break';

export function Timer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();
  const { notify } = useNotification();
  const { tasks, completeTask, changeStatus } = useTasks();

  const taskId = (location.state as { taskId?: string })?.taskId;
  const task = tasks.find((t) => t.id === taskId);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [pomodoroIndex, setPomodoroIndex] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState<number[]>([]);
  const [failedPomodoros, setFailedPomodoros] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (task) {
      setActiveTask(task);
    } else if (!taskId && user) {
      navigate('/task-list');
    }
  }, [task, taskId, user, navigate]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(
    (minutes: number) => {
      clearTimer();
      let seconds = minutes * 60;
      setTimeLeft(seconds);

      intervalRef.current = window.setInterval(() => {
        seconds -= 1;
        setTimeLeft(seconds);

        if (seconds <= 0) {
          clearTimer();
          if (phase === 'work') {
            handleFinishPomodoro(true);
          } else {
            setPhase('idle');
          }
        }
      }, 1000);
    },
    [clearTimer, phase],
  );

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  function startWork() {
    setPhase('work');
    startCountdown(settings.work.value);
  }

  function handleFinishPomodoro(success: boolean) {
    clearTimer();
    const idx = pomodoroIndex;

    if (success) {
      setCompletedPomodoros((prev) => [...prev, idx]);
      notify('success', 'Pomodoro completed!');
    } else {
      setFailedPomodoros((prev) => [...prev, idx]);
      notify('warning', 'Pomodoro failed');
    }

    const nextIndex = idx + 1;
    setPomodoroIndex(nextIndex);

    if (activeTask && nextIndex >= activeTask.estimation) {
      handleFinishTask();
      return;
    }

    const isLong = (nextIndex % settings.iteration.value) === 0;
    const breakTime = isLong ? settings.longBreak.value : settings.shortBreak.value;

    if (isLong) {
      notify('info', 'Long break — have a rest!');
    }

    setPhase('break');
    startCountdown(breakTime);
  }

  function handleFinishTask() {
    clearTimer();
    if (!activeTask) return;

    const updated: Task = {
      ...activeTask,
      completedCount: completedPomodoros,
      failedPomodoros: failedPomodoros,
    };

    completeTask(updated);
    setIsFinished(true);
    notify('success', 'Task completed!');
  }

  function handleAddPomodoro() {
    if (!activeTask || activeTask.estimation >= 10) return;
    setActiveTask({ ...activeTask, estimation: activeTask.estimation + 1 });
  }

  function handleBackToTasks() {
    clearTimer();
    if (activeTask && !isFinished) {
      changeStatus(activeTask.id, 'DAILY_LIST');
    }
    navigate('/task-list');
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!activeTask) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const categoryColor = CATEGORY_COLORS[activeTask.categoryId];
  const totalSeconds =
    phase === 'work'
      ? settings.work.value * 60
      : phase === 'break'
        ? (pomodoroIndex % settings.iteration.value === 0
            ? settings.longBreak.value
            : settings.shortBreak.value) * 60
        : 1;
  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={handleBackToTasks}>
        &larr; Back to Tasks
      </button>

      <div className={styles.timerSection}>
        <h2 className={styles.taskTitle}>{activeTask.title}</h2>
        <p className={styles.taskSubtitle}>{activeTask.description}</p>

        {/* Timer Circle */}
        <div className={styles.timerCircle} role="timer" aria-label={`Timer: ${formatTime(timeLeft)}`}>
          <svg viewBox="0 0 200 200" className={styles.svg}>
            <circle cx="100" cy="100" r="88" fill="none" stroke="var(--bg-elevated)" strokeWidth="6" />
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke={categoryColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              transform="rotate(-90 100 100)"
              className={styles.progressRing}
            />
          </svg>
          <div className={styles.timerText}>
            {isFinished ? (
              <span className={styles.finishedText}>Done!</span>
            ) : phase === 'idle' ? (
              <span className={styles.idleText}>Ready</span>
            ) : (
              <>
                {phase === 'break' && <span className={styles.breakLabel}>break</span>}
                <span className={styles.time}>{formatTime(timeLeft)}</span>
                <span className={styles.timeLabel}>{phase === 'work' ? 'focus' : 'rest'}</span>
              </>
            )}
          </div>
        </div>

        {/* Estimation */}
        <div className={styles.estimation} aria-label="Pomodoro progress">
          {Array.from({ length: activeTask.estimation }, (_, i) => (
            <span
              key={i}
              className={`${styles.pomodoro} ${completedPomodoros.includes(i) ? styles.done : ''} ${failedPomodoros.includes(i) ? styles.failed : ''}`}
            />
          ))}
          {!isFinished && activeTask.estimation < 10 && (
            <button className={styles.addPomBtn} onClick={handleAddPomodoro} aria-label="Add pomodoro">
              +
            </button>
          )}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {isFinished ? (
            <>
              <button className={styles.primaryBtn} onClick={() => navigate('/task-list')}>
                Back to Tasks
              </button>
              <button className={styles.secondaryBtn} onClick={() => navigate('/reports/day/pomodoros')}>
                View Reports
              </button>
            </>
          ) : phase === 'idle' ? (
            <button className={styles.primaryBtn} onClick={startWork}>
              Start Pomodoro
            </button>
          ) : phase === 'work' ? (
            <>
              <button className={styles.dangerBtn} onClick={() => handleFinishPomodoro(false)}>
                Fail Pomodoro
              </button>
              <button className={styles.successBtn} onClick={() => handleFinishPomodoro(true)}>
                Finish Pomodoro
              </button>
            </>
          ) : (
            <>
              <button className={styles.primaryBtn} onClick={startWork}>
                Start Pomodoro
              </button>
              <button className={styles.secondaryBtn} onClick={handleFinishTask}>
                Finish Task
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
