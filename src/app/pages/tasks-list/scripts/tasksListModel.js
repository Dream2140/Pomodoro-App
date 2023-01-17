import { Helpers } from '../../../helpers/helpers';
import { Observer } from '../../../helpers/observer';
import { settingsData } from '../../../helpers/settingsData';

/**
 * @description manages task-list data
 * @exports TasksListModel
 * @class TasksListModel
 */
export class TasksListModel {
  /**
   * @description Creates an instance of TasksListModel.
   * @memberof TasksListModel
   */
  constructor() {

    this.taskListCollection = [];
    this.settingsData = settingsData;
    this.taskListSettings = {
      buttonAddTask: true,
      deleteBtn: true,
      titlePlusBtn: true,
      leftTabs: true,
      typeTabs: 'daily-content__tabs',
      tabPosition: 'tab__item--right',
      tabData: [{
        serviceClass: 'tab__btn-toDo',
        data: 'To Do'
      },
      {
        serviceClass: 'tab__btn-done',
        data: 'Done'
      }
      ]
    };

    this.orderTasksEvent = new Observer();
    this.taskListChangedEvent = new Observer();
    this.renderTasksDonePageEvent = new Observer();
    this.renderNoTasksLeftPageEvent = new Observer();
    this.renderAddFirstTaskPageEvent = new Observer();
    this.renderEmptyDailyTasks = new Observer();
    this.registerNewUser = new Observer();
  }

  /**
   * @description saves tasks list from database
   * @memberof TasksListModel
   */
  async getAndSaveTaskList() {
    const userId = this.settingsData.getDataFromStorage('userId');
    let data = await this.settingsData.getTasksData(userId);
    data = Object.keys(data).map(function (key) {
      return data[key];
    });

    if (Array.isArray(data) && data.length) {
      data = data.filter(item => !!item);
      this.taskListCollection = data;

      this.createTaskListCollection();
    } else {
      this.renderAddFirstTaskPageEvent.notify();
    }
  }

  async registerNewsUser(email, password) {
    await this.settingsData.registerUser(email, password);
  }

  async loginUser(email, password) {
    await this.settingsData.loginUser(email, password);
  }

  /**
   * @description sorts tasks by type
   * @param {string} priority field to sort
   * @return {undefined}
   * @memberof TasksListModel
   */
  orderTasks(priority) {

    if (priority === 'all') {
      this.orderTasksEvent.notify([
        [], this.globalTasksActive
      ]);
      this.orderTasksEvent.notify([
        [], this.globalTasksCompleted
      ]);

      return;
    }

    let tasksActive, tasksCompleted;

    if (this.globalTasksActive) {
      tasksActive = this.globalTasksActive.filter(
        task => task.priority !== priority
      );
      this.orderTasksEvent.notify([tasksActive, this.globalTasksActive]);
    }

    if (this.globalTasksCompleted) {
      tasksCompleted = this.globalTasksCompleted.filter(
        task => task.priority !== priority
      );
      this.orderTasksEvent.notify([tasksCompleted, this.globalTasksCompleted]);
    }
  }

  /**
   * @description filters tasks and emits render
   * @memberof TasksListModel
   */
  createTaskListCollection() {

    this.globalTasksActive = this.taskListCollection.filter(
      task => task.status === 'GLOBAL_LIST' && !task.completeDate
    );

    this.globalTasksCompleted = this.taskListCollection.filter(
      task =>
        task.status === 'COMPLETED' &&
        task.completeDate !== Helpers.getCurrentDate()
    );

    this.dailyTasksActive = this.taskListCollection
      .filter(task => task.status === 'DAILY_LIST' && !task.completeDate)
      .sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);

    this.dailyTasksCompleted = this.taskListCollection.filter(task =>
      task.status === 'COMPLETED' &&
      task.completeDate === Helpers.getCurrentDate()
    ).sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);

    if (this.globalTasksActive.length) {
      this.globalTasksActiveCategories = this.createCategories(
        this.globalTasksActive,
        Helpers.createCategoriesObj()
      );
    } else {
      this.globalTasksActiveCategories = null;
    }

    if (this.globalTasksCompleted.length) {
      this.globalTasksCompletedCategories = this.createCategories(
        this.globalTasksCompleted,
        Helpers.createCategoriesObj()
      );
    } else {
      this.globalTasksCompleted = null;
    }

    this.tasksCollection = {
      dailyActive: this.dailyTasksActive,
      dailyCompleted: this.dailyTasksCompleted,
      globalActive: this.globalTasksActiveCategories,
      globalCompleted: this.globalTasksCompletedCategories,
    };

    if (this.checkLeftTasks()) {
      this.taskListChangedEvent.notify(this.tasksCollection);
    }
  }

  /**
   * @description creates data for render
   * @param {object} data tasks
   * @param {object} objectPrototype empty object to fill with tasks
   * @return {object} tasks data for render
   * @memberof TasksListModel
  */
  createCategories(data, objectPrototype) {
    if (!Array.isArray(data) || !data.length || typeof objectPrototype !== 'object') {
      return;
    }

    for (const [key] of Object.entries(objectPrototype)) {
      objectPrototype[key].tasks = data
        .filter(item => item.categoryId === key)
        .sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);
      objectPrototype[key].title = key;
    }

    return objectPrototype;
  }

  /**
   * @description gets item from session storage and returns it
   * @return {boolean} true if it's a first opening of app
   * @memberof TasksListModel
   */
  isNewUser() {
    return JSON.parse(sessionStorage.getItem('userId'));
  }

  /**
   * @description checks if there are tasks left and
   * emits appropriate render event
   * @return {undefined}
   * @memberof TasksListModel
   */
  checkLeftTasks() {
    if (this.taskListCollection.length === 0) {
      this.renderNoTasksLeftPageEvent.notify();

      return true;
    }

    if (this.dailyTasksActive.length === 0 && this.globalTasksActive.length) {
      this.renderEmptyDailyTasks.notify();

      return true;
    }

    if (
      this.dailyTasksActive.length === 0 &&
      this.globalTasksActive.length === 0 &&
      this.dailyTasksCompleted.length === 0
    ) {
      this.renderAddFirstTaskPageEvent.notify();
      return true;
    }

    if (this.dailyTasksActive.length === 0 && this.globalTasksActive.length === 0) {
      this.renderNoTasksLeftPageEvent.notify();
      return true;
    }

    return true;
  }

  /**
   * @description creates and saves new task
   * @param {object} data task data
   * @memberof TasksListModel
   */
  createNewTask(data) {

    if (!data || typeof (data) !== 'object') return;

    const newTask = {
      ...data,
      status: 'GLOBAL_LIST',
      createDate: this.getCurrentDate(),
      completedCount: [],
      failedPomodoros: [],
      completeDate: null,
      deadlineDate: this.getCurrentDate(data.deadline),
      id: Helpers.generateUniqueId()
    };

    this.taskListCollection.push(newTask);

    this.createTaskListCollection();
    this.sendTaskData(newTask, newTask.id);


  }

  /**
   * @description sends task data to database
   * @param {string} key to save data
   * @param {object} data to save
   * @param {string} id of task
   * @memberof TasksListModel
   */
  sendTaskData(data, id) {
    //this.sendTaskData('tasks', newTask, newTask.id);
    this.settingsData
      .sendTask({ [id]: data })
      .then(() => {
        $(document).notification('clean');
        $(document).notification({
          type: 'success',
          text: 'Your task was successfully saved',
          showTime: 3,
        });
      })
      .catch(error => {
        $(document).notification('clean');
        $(document).notification({
          type: 'error',
          text: error,
        });
      });
  }

  /**
   * @description creates date object
   * @param {string} date of deadline
   * @return {object} deadline date
   * @memberof TasksListModel
   */
  getCurrentDate(date) {

    let currentDate =
      date && typeof date === 'string' ? new Date(date) : new Date();

    const options = {
      month: 'long',
    };

    return {
      fullDeadline: currentDate.getTime(),
      month: Intl.DateTimeFormat('en-US', options).format(currentDate),
      day: currentDate.getDate(),
    };
  }

  /**
   * @description sets new status for task
   * @param {string} id task id
   * @param {string} newStatus status of task
   * @return {object} promise object
   * @memberof TasksListModel
   */
  changeTaskStatus(id, newStatus) {

    if (!id || !newStatus) return;

    const taskToBeChanged = this.taskListCollection.find(
      task => task.id === id
    );
    taskToBeChanged.status = newStatus;

    return this.settingsData.sendTask({ [id]: taskToBeChanged });
  }

  /**
   * @description removes tasks by ids and emits render event
   * @param {object} ids of tasks to be removed
   * @return {object} promise object
   * @memberof TasksListModel
   */
  removeTask(ids) {

    if (!Array.isArray(ids)) return;

    const taskIndexesToRemove = [];
    this.taskListCollection.forEach(item => {
      ids.forEach(id => {
        if (item.id === id) {
          taskIndexesToRemove.push(this.taskListCollection.indexOf(item));
        }
      });
    });

    this.taskListCollection = this.taskListCollection.filter(
      (e, i) => taskIndexesToRemove.indexOf(i) < 0
    );

    if (this.taskListCollection.length === 0) {
      this.renderNoTasksLeftPageEvent.notify();
    } else if (this.dailyTasksActive.length === 0 && this.globalTasksActive.length) {
      this.renderTasksDonePageEvent.notify();
    } else if (
      this.dailyTasksActive.length === 0 &&
      this.globalTasksActive.length === 0 &&
      this.dailyTasksCompleted.length === 0 &&
      this.globalTasksCompleted.length === 0
    ) {
      this.renderNoTasksLeftPageEvent.notify();
    }

    return this.settingsData.removeItem(ids);
  }

  /**
   * @description finds and returns task by id
   * @param {string} id task id
   * @return {task} task with current id
   * @memberof TasksListModel
   */
  getTaskById(id) {
    if (id && typeof id === 'string') {
      return this.taskListCollection.find(task => task.id === id);
    }
  }

  /**
   * @description saves task to session storage
   * @param {string} id task id
   * @memberof TasksListModel
   */
  saveTaskToStorage(id) {
    if (!id) return;
    this.settingsData.setDataToStorage('active-task', this.getTaskById(id));
  }

  /**
   * @description updates tasks data
   * @param {object} task to be updated
   * @memberof TasksListModel
   */
  updateTask(task) {
    if (!task) return;

    const updatedTask = Object.assign(task);

    updatedTask.deadlineDate = this.getCurrentDate(updatedTask.deadline);

    let oldTask = this.taskListCollection.find(item => item.id === updatedTask.id);
    this.taskListCollection.splice(
      this.taskListCollection.indexOf(oldTask),
      1,
      updatedTask
    );

    this.createTaskListCollection();
    this.sendTaskData( updatedTask, updatedTask.id);
  }

}
