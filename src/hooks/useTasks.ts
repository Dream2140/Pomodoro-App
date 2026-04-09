import { useCallback, useEffect, useState } from 'react';
import type { Task, CategoryId, Priority } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import {
  getUserTasks,
  saveTask as saveTaskToDb,
  removeTask as removeTaskFromDb,
} from '@/services/firebase';
import { generateUniqueId, formatDate, createTaskDate } from '@/utils/helpers';

export function useTasks() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getUserTasks(user.uid);
      if (data) {
        const taskList = Object.values(data).filter(Boolean);
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    } catch {
      notify('error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user, notify]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(
    async (data: {
      title: string;
      description: string;
      deadline: string;
      categoryId: CategoryId;
      estimation: number;
      priority: Priority;
    }) => {
      if (!user) return;

      const newTask: Task = {
        ...data,
        id: generateUniqueId(),
        status: 'GLOBAL_LIST',
        createDate: createTaskDate(),
        deadlineDate: createTaskDate(data.deadline),
        completedCount: [],
        failedPomodoros: [],
        completeDate: null,
      };

      setTasks((prev) => [...prev, newTask]);

      try {
        await saveTaskToDb(user.uid, newTask);
        notify('success', 'Task saved successfully');
      } catch {
        notify('error', 'Failed to save task');
      }
    },
    [user, notify],
  );

  const updateTask = useCallback(
    async (task: Task) => {
      if (!user) return;

      const updated = { ...task, deadlineDate: createTaskDate(task.deadline) };
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));

      try {
        await saveTaskToDb(user.uid, updated);
        notify('success', 'Task updated successfully');
      } catch {
        notify('error', 'Failed to update task');
      }
    },
    [user, notify],
  );

  const changeStatus = useCallback(
    async (taskId: string, newStatus: Task['status']) => {
      if (!user) return;

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const updated = { ...t, status: newStatus };
            if (newStatus === 'COMPLETED') {
              updated.completeDate = formatDate();
            }
            saveTaskToDb(user.uid, updated);
            return updated;
          }
          return t;
        }),
      );
    },
    [user],
  );

  const deleteTask = useCallback(
    async (taskIds: string[]) => {
      if (!user) return;

      setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)));

      try {
        await Promise.all(taskIds.map((id) => removeTaskFromDb(user.uid, id)));
        notify('success', 'Task removed successfully');
      } catch {
        notify('error', 'Failed to remove task');
      }
    },
    [user, notify],
  );

  const completeTask = useCallback(
    async (task: Task) => {
      if (!user) return;

      const completed: Task = {
        ...task,
        status: 'COMPLETED',
        completeDate: formatDate(),
      };

      setTasks((prev) => prev.map((t) => (t.id === task.id ? completed : t)));

      try {
        await saveTaskToDb(user.uid, completed);
      } catch {
        notify('error', 'Failed to complete task');
      }
    },
    [user, notify],
  );

  const today = formatDate();

  const globalActive = tasks.filter((t) => t.status === 'GLOBAL_LIST' && !t.completeDate);
  const globalCompleted = tasks.filter((t) => t.status === 'COMPLETED' && t.completeDate !== today);
  const dailyActive = tasks
    .filter((t) => t.status === 'DAILY_LIST' && !t.completeDate)
    .sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);
  const dailyCompleted = tasks
    .filter((t) => t.status === 'COMPLETED' && t.completeDate === today)
    .sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);

  return {
    tasks,
    loading,
    globalActive,
    globalCompleted,
    dailyActive,
    dailyCompleted,
    createTask,
    updateTask,
    changeStatus,
    deleteTask,
    completeTask,
    reload: loadTasks,
  };
}
