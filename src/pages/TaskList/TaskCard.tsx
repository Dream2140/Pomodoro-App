import type { Task } from '@/types';
import { CATEGORY_COLORS, PRIORITY_COLORS } from '@/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  showDate?: boolean;
  onStart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveToDaily?: () => void;
}

export function TaskCard({
  task,
  showDate = true,
  onStart,
  onEdit,
  onDelete,
  onMoveToDaily,
}: TaskCardProps) {
  const categoryColor = CATEGORY_COLORS[task.categoryId];
  const priorityColor = PRIORITY_COLORS[task.priority];
  const isCompleted = task.status === 'COMPLETED';

  return (
    <article
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      <div className={styles.categoryMark} style={{ backgroundColor: categoryColor }} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{task.title}</h4>
          <span className={styles.priority} style={{ backgroundColor: priorityColor }}>
            {task.priority}
          </span>
        </div>
        <p className={styles.description}>{task.description}</p>
        {showDate && task.deadlineDate && (
          <span className={styles.date}>
            {task.deadlineDate.month} {task.deadlineDate.day}
          </span>
        )}

        <div className={styles.estimation}>
          {Array.from({ length: task.estimation }, (_, i) => {
            const isCompletedPom = task.completedCount?.includes(i);
            const isFailedPom = task.failedPomodoros?.includes(i);
            return (
              <span
                key={i}
                className={`${styles.pomodoro} ${isCompletedPom ? styles.done : ''} ${isFailedPom ? styles.failed : ''}`}
                aria-label={
                  isCompletedPom ? 'Completed pomodoro' : isFailedPom ? 'Failed pomodoro' : 'Pending pomodoro'
                }
              />
            );
          })}
        </div>

        {!isCompleted && (
          <div className={styles.actions}>
            {onStart && (
              <button className={styles.startBtn} onClick={onStart} aria-label="Start timer for this task">
                Start
              </button>
            )}
            {onMoveToDaily && (
              <button className={styles.moveBtn} onClick={onMoveToDaily} aria-label="Move to daily list">
                &#8593; Daily
              </button>
            )}
            {onEdit && (
              <button className={styles.editBtn} onClick={onEdit} aria-label="Edit task">
                Edit
              </button>
            )}
            {onDelete && (
              <button className={styles.deleteBtn} onClick={onDelete} aria-label="Delete task">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
