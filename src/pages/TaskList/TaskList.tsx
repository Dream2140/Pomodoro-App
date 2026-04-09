import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '@/hooks/useTasks';
import { Modal } from '@/components/Modal/Modal';
import { TaskForm } from '@/components/Modal/TaskForm';
import { TaskCard } from './TaskCard';
import type { Task, CategoryId } from '@/types';
import { CATEGORIES } from '@/types';
import styles from './TaskList.module.css';

export function TaskList() {
  const navigate = useNavigate();
  const {
    loading,
    globalActive,
    globalCompleted,
    dailyActive,
    dailyCompleted,
    createTask,
    updateTask,
    changeStatus,
    deleteTask,
  } = useTasks();

  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [showGlobal, setShowGlobal] = useState(true);
  const [modalTask, setModalTask] = useState<Task | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<string[] | null>(null);

  if (loading) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  const filteredGlobalActive =
    categoryFilter === 'all'
      ? globalActive
      : globalActive.filter((t) => t.categoryId === categoryFilter);

  const filteredGlobalCompleted =
    categoryFilter === 'all'
      ? globalCompleted
      : (globalCompleted ?? []).filter((t) => t.categoryId === categoryFilter);

  function openCreateModal() {
    setModalTask(undefined);
    setShowModal(true);
  }

  function openEditModal(task: Task) {
    setModalTask(task);
    setShowModal(true);
  }

  function handleStartTask(taskId: string) {
    changeStatus(taskId, 'ACTIVE');
    navigate('/timer', { state: { taskId } });
  }

  function handleMoveToDailyList(taskId: string) {
    changeStatus(taskId, 'DAILY_LIST');
  }

  const groupByCategory = (tasks: Task[]) => {
    const groups: Partial<Record<CategoryId, Task[]>> = {};
    tasks.forEach((t) => {
      if (!groups[t.categoryId]) groups[t.categoryId] = [];
      groups[t.categoryId]!.push(t);
    });
    return groups;
  };

  const activeCategoryGroups = groupByCategory(filteredGlobalActive);
  const completedCategoryGroups = groupByCategory(filteredGlobalCompleted ?? []);

  const hasTasks = dailyActive.length > 0 || globalActive.length > 0;

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'todo'}
          className={`${styles.tab} ${activeTab === 'todo' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          To Do
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'done'}
          className={`${styles.tab} ${activeTab === 'done' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('done')}
        >
          Done
        </button>
        <button className={styles.addTaskBtn} onClick={openCreateModal}>
          + Add Task
        </button>
      </div>

      {!hasTasks && activeTab === 'todo' && (
        <div className={styles.emptyMessage}>
          <p>No tasks yet. Create your first task to get started!</p>
          <button className={styles.createBtn} onClick={openCreateModal}>
            Create Task
          </button>
        </div>
      )}

      {/* Daily Tasks */}
      {activeTab === 'todo' && dailyActive.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Daily Tasks</h2>
          <div className={styles.taskGrid}>
            {dailyActive.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={() => handleStartTask(task.id)}
                onEdit={() => openEditModal(task)}
                onDelete={() => setConfirmDeleteIds([task.id])}
                showDate={false}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'done' && dailyCompleted.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Completed Today</h2>
          <div className={styles.taskGrid}>
            {dailyCompleted.map((task) => (
              <TaskCard key={task.id} task={task} showDate={false} />
            ))}
          </div>
        </section>
      )}

      {/* Global Tasks */}
      {showGlobal && (
        <section className={styles.section}>
          <div className={styles.globalHeader}>
            <button className={styles.toggleBtn} onClick={() => setShowGlobal(!showGlobal)}>
              <span className={styles.arrow}>&#9660;</span>
              <h2 className={styles.sectionTitle}>Global List</h2>
            </button>
            <div className={styles.categoryFilter} role="tablist" aria-label="Filter by category">
              <button
                className={`${styles.filterBtn} ${categoryFilter === 'all' ? styles.activeFilter : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${styles[cat]} ${categoryFilter === cat ? styles.activeFilter : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'todo' &&
            Object.entries(activeCategoryGroups).map(([cat, tasks]) => (
              <div key={cat} className={styles.categoryGroup}>
                <h3 className={`${styles.categoryTitle} ${styles[cat]}`}>{cat}</h3>
                <div className={styles.taskGrid}>
                  {tasks!.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMoveToDaily={() => handleMoveToDailyList(task.id)}
                      onStart={() => handleStartTask(task.id)}
                      onEdit={() => openEditModal(task)}
                      onDelete={() => setConfirmDeleteIds([task.id])}
                    />
                  ))}
                </div>
              </div>
            ))}

          {activeTab === 'done' &&
            Object.entries(completedCategoryGroups).map(([cat, tasks]) => (
              <div key={cat} className={styles.categoryGroup}>
                <h3 className={`${styles.categoryTitle} ${styles[cat]}`}>{cat}</h3>
                <div className={styles.taskGrid}>
                  {tasks!.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}

      {!showGlobal && (
        <button className={styles.toggleBtn} onClick={() => setShowGlobal(true)}>
          <span className={styles.arrowRight}>&#9654;</span>
          <h2 className={styles.sectionTitle}>Global List</h2>
        </button>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal title={modalTask ? 'Edit Task' : 'New Task'} onClose={() => setShowModal(false)}>
          <TaskForm
            task={modalTask}
            onSubmit={(data) => {
              if (modalTask) {
                updateTask({ ...modalTask, ...data });
              } else {
                createTask(data);
              }
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteIds && (
        <Modal title="Confirm Delete" onClose={() => setConfirmDeleteIds(null)}>
          <div className={styles.confirmDelete}>
            <p>Are you sure you want to delete this task?</p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.deleteConfirmBtn}
                onClick={() => {
                  deleteTask(confirmDeleteIds);
                  setConfirmDeleteIds(null);
                }}
              >
                Delete
              </button>
              <button className={styles.cancelBtn} onClick={() => setConfirmDeleteIds(null)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
