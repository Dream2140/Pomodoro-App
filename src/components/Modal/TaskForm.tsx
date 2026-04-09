import { useState } from 'react';
import type { Task, CategoryId, Priority } from '@/types';
import { CATEGORIES } from '@/types';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: {
    title: string;
    description: string;
    deadline: string;
    categoryId: CategoryId;
    estimation: number;
    priority: Priority;
  }) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [deadline, setDeadline] = useState(task?.deadline ?? '');
  const [categoryId, setCategoryId] = useState<CategoryId>(task?.categoryId ?? 'work');
  const [estimation, setEstimation] = useState(task?.estimation ?? 1);
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'middle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title, description, deadline, categoryId, estimation, priority });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="task-title" className={styles.label}>
          Title
        </label>
        <input
          id="task-title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-description" className={styles.label}>
          Description
        </label>
        <textarea
          id="task-description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-deadline" className={styles.label}>
          Deadline
        </label>
        <input
          id="task-deadline"
          type="date"
          className={styles.input}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Category</label>
        <div className={styles.radioGroup}>
          {CATEGORIES.map((cat) => (
            <label key={cat} className={`${styles.radioLabel} ${styles[cat]}`}>
              <input
                type="radio"
                name="category"
                value={cat}
                checked={categoryId === cat}
                onChange={() => setCategoryId(cat)}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="task-estimation" className={styles.label}>
            Pomodoros
          </label>
          <input
            id="task-estimation"
            type="number"
            min={1}
            max={10}
            className={styles.input}
            value={estimation}
            onChange={(e) => setEstimation(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <select
            className={styles.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="middle">Middle</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className={styles.buttons}>
        <button type="submit" className={styles.submitBtn}>
          {task ? 'Update Task' : 'Add Task'}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
