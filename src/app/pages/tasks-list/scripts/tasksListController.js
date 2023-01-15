import { eventBus } from '../../../helpers/eventBus';
import { router } from '../../../routes';

/**
 * @description controls task-list component
 * @exports TasksListController
 * @class TasksListController
 */
export class TasksListController {

  /**
   * @description Creates an instance of TasksListController
   * @param {*} view instance of TasksListView
   * @param {*} model instance of TasksListModel
   * @memberof TasksListController
   */
  constructor(view, model) {

    this.view = view;
    this.model = model;

    eventBus.subscribe('task-list-loading', () => {
      eventBus.post('renderTaskListPage', this.model.isNewUser());
    });

    eventBus.subscribe('start-task', id => {
      this.model.changeTaskStatus(id, 'ACTIVE');
      this.model.saveTaskToStorage(id);
      router.navigate('/timer');
    });

    eventBus.subscribe('order-tasks', category => {
      this.model.orderTasks(category);
    });

    eventBus.subscribe('move-to-daily-list', id => {
      this.model.changeTaskStatus(id, 'DAILY_LIST').then(() => {
        $(document).notification('clean');
        $(document).notification({
          type: 'info',
          text: 'Your task was moved to the daily task list',
          showTime: 3
        });
      })
        .catch(() => {
          $(document).notification('clean');
          $(document).notification({
            type: 'error',
            text: 'Unable to move to the daily task list. Try again later'
          });
        });
      eventBus.post('render-page');
    });

    eventBus.subscribe('update-task', task => {
      this.model.updateTask(task);
      eventBus.post('render-page');
    });

    eventBus.subscribe('remove-task', ids => {
      this.model.removeTask(ids).then(() => {
        $(document).notification('clean');
        $(document).notification({
          type: 'success',
          text: 'Your task was successfully removed',
          showTime: 3
        });
      })
        .catch(() => {
          $(document).notification('clean');
          $(document).notification({
            type: 'error',
            text: 'Unable to remove task. Try again later'
          });
        });
      eventBus.post('render-page');
    });

    eventBus.subscribe('edit-task', id => {
      eventBus.post('open-modal', this.model.getTaskById(id));
    });

    eventBus.subscribe('end-task-working', activeTask => {
      if (activeTask.status === 'COMPLETED') {
        eventBus.post('render-page');
      } else {
        this.model.changeTaskStatus(activeTask.id, 'DAILY_LIST');
      }
    });
  }
}