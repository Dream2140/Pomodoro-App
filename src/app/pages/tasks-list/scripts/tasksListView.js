import { eventBus } from '../../../helpers/eventBus';
import taskTemplate from '../components/task/template/task.hbs';
import noTasksMessageTemplate from '../template/add-firts-task.hbs';
import * as firstPageTemplate from '../template/firstPage.hbs';
import noDailyTasksMessageTemplate from '../template/task-added.hbs';
import allTasksDoneTemplate from '../template/all-tasks-done.hbs';
import * as tasksListTemplate from '../template/tasksList.hbs';
import noTasksLeftTemplate from '../template/no-tasks.hbs';

import { router } from '../../../routes';
import { settingsData } from '../../../helpers/settingsData';

/**
 * @description manages task-list view
 * @exports TasksListView
 * @class TasksListView
 */
export class TasksListView {

  /**
   * @description Creates an instance of TasksListView
   * @param {object} model instance of TasksListView
   * @memberof TasksListView
   */
  constructor(model) {
    this.model = model;
    this.firstPageTemplate = firstPageTemplate;
    this.tasksListPage = tasksListTemplate;

    this.model.taskListChangedEvent.subscribe(this.renderDailyTasks.bind(this));

    this.model.taskListChangedEvent.subscribe(
      this.renderGlobalTasks.bind(this)
    );

    this.model.orderTasksEvent.subscribe(
      this.orderTasks.bind(this)
    );

    this.model.renderAddFirstTaskPageEvent.subscribe(
      this.renderEmptyPageMessage.bind(this)
    );

    this.model.renderEmptyDailyTasks.subscribe(
      this.renderEmptyDailyTasksMessage.bind(this)
    );

    this.model.renderTasksDonePageEvent.subscribe(
      this.renderAllTasksDoneMessage.bind(this)
    );

    this.model.renderNoTasksLeftPageEvent.subscribe(
      this.renderNoTasksLeftMessage.bind(this)
    );


    eventBus.subscribe('register-user', (data) => {
      this.model.registerNewsUser(data.mail, data.password);
    });
    eventBus.subscribe('login-user', (data) => {
      this.model.loginUser(data.mail, data.password);
    });

    eventBus.subscribe('renderTaskListPage', async (isNewUser) => {
      if (!isNewUser) {
        eventBus.post('auth-modal');
        this.addAuthBtnsEventListeners();
      } else {
        this.renderTaskListContainer();
        eventBus.post('pageLoaded');
        await this.model.getAndSaveTaskList();
      }
    });
    eventBus.subscribe('user-login-result', async (data) => {
      if (data.result === true) {
        eventBus.post('close-modal');
        settingsData.setDataToStorage('userId', data.userData.user.uid);
        this.renderTaskListContainer();
        eventBus.post('pageLoaded');
        await this.model.getAndSaveTaskList();
        $(document).notification('clean');
        $(document).notification({
          type: 'success',
          text: 'You are logged in',
          showTime: 3,
        });
      } else {
        $(document).notification('clean');
        $(document).notification({
          type: 'error',
          text: data.message,
          showTime: 3,
        });
      }
    });

    eventBus.subscribe('user-regestration-result', async (data) => {
      if (data.result === true) {
        this.renderFirstPage();
        eventBus.post('close-modal');
        settingsData.setDataToStorage('userId', data.userData.user.uid);

        $(document).notification('clean');
        $(document).notification({
          type: 'success',
          text: `User with email ${data.userData.user.email} successfuly registered`,
          showTime: 3,
        });
      } else {
        $(document).notification('clean');
        $(document).notification({
          type: 'error',
          text: data.message,
          showTime: 3,
        });
      }
    });

    eventBus.subscribe('render-page', () => {
      this.renderTaskListContainer(this.model.taskListSettings);
      this.model.createTaskListCollection();
      eventBus.post('pageLoaded');
    });

    eventBus.subscribe('create-task', data => {
      this.renderTaskListContainer(this.model.taskListTemplateData);
      this.model.createNewTask(data);
      eventBus.post('pageLoaded');
    });

    eventBus.subscribe('toggle-remove-tasks-mode', () => {
      this.renderDeleteMode();
    });
  }

  addAuthBtnsEventListeners() {
    document.querySelector('.service-btn__btn-register').addEventListener('click', (e) => {
      e.preventDefault();

      const form = new FormData(document.querySelector('.modal__form'));
      const mail = form.get('mail');
      const password = form.get('password');
      eventBus.post('register-user', { mail, password });
    });

    document.querySelector('.service-btn__btn-login').addEventListener('click', (e) => {

      e.preventDefault();
      const form = new FormData(document.querySelector('.modal__form'));
      const mail = form.get('mail');
      const password = form.get('password');
      eventBus.post('login-user', { mail, password });
    });
  }

  /**
   * @description renders no tasks left template
   * @memberof TaskDailyListView
   */
  renderEmptyPageMessage() {
    document.querySelector('.daily-content__content').innerHTML = noTasksMessageTemplate();
  }

  /**
   * @description renders empty daily tasks message template
   * @memberof TaskDailyListView
   */
  renderEmptyDailyTasksMessage() {
    document.querySelector('.daily-content__content').innerHTML = noDailyTasksMessageTemplate();
  }

  /**
   * @description renders container for tasks list page
   * @param {object} data for render
   * @memberof TasksListView
   */
  renderTaskListContainer() {
    this.renderTasksListPage();

    document.querySelector('.navigation__icon--delete').addEventListener('click', () => {
      eventBus.post('open-delete-mode');
    });

    this.addTaskListTabsEvent();
  }

  /**
   * @description renders first screen template
   * @param {object} data for render
   * @memberof TasksListView
   */
  renderFirstPage() {
    document.body.innerHTML = this.firstPageTemplate(this.model.taskListSettings);
    this.setFirstPageBtnListeners();
  }

  /**
   * @description renders task list template
   * @param {object} data for render
   * @memberof TasksListView
   */
  renderTasksListPage() {
    document.body.innerHTML = this.tasksListPage(this.model.taskListSettings);
  }

  /**
   * @description add listeners for first page view
   * @param {object} data for render
   * @memberof TasksListView
   */
  setFirstPageBtnListeners() {

    document.querySelector('.message__buttons-skip').addEventListener('click', () => {
      document.location.reload();
      eventBus.post('pageLoaded');
    });

    document.querySelector('.message__buttons-settings').addEventListener('click', () => {
      router.navigate('/settings/pomodoros');
    });
  }

  /**
   * @description renders global tasks and adds events listeners
   * @param {object} tasks tasks for rendering
   * @return {undefined}
   * @memberof TaskGlobalListView
   */
  renderGlobalTasks(tasks) {
    if (!tasks) return;

    const containerActive = document.querySelector('.global-list__content');
    const containerCompleted = document.querySelector('.global-list__content--done');

    containerActive.classList.remove('d-none');

    const activeTasks = tasks.globalActive;
    const completedTasks = tasks.globalCompleted;

    if (!activeTasks && !completedTasks) {
      containerActive.classList.add('d-none');

      return;
    }

    this.renderTasks([activeTasks, containerActive]);
    this.renderTasks([completedTasks, containerCompleted]);
    this.addGeneralTaskEvents();
    this.addDailyTaskButtonsEvents(containerActive);
  }

  /**
   * @description adds tab event lisreners for tabs on task list page
   * @param {object} tasks tasks for rendering
   * @return {undefined}
   * @memberof TaskGlobalListView
   */
  addTaskListTabsEvent() {
    const tabs = document.querySelector('.daily-content__tabs .tab__item--right');
    const tabToDo = document.querySelector('.tab__btn-toDo');
    const tabDone = document.querySelector('.tab__btn-done');
    const container = [
      document.querySelector('.global-list__content'),
      document.querySelector('.global-list__content--done'),
      document.querySelector('.daily-content__content'),
      document.querySelector('.daily-content__content--done')
    ];

    tabs.addEventListener('click', e => {
      container.forEach(content => content.classList.add('d-none'));

      if (e.target === tabToDo) {
        document.querySelector('.daily-content__content').classList.remove('d-none');
        document.querySelector('.global-list__content').classList.remove('d-none');
      }

      if (e.target === tabDone) {
        document.querySelector('.daily-content__content--done').classList.remove('d-none');
        document.querySelector('.global-list__content--done').classList.remove('d-none');
      }
    });
  }

  /**
   * @description adds tab event lisreners for task list page
   * @param {object} tasks tasks for rendering
   * @return {undefined}
   * @memberof TaskGlobalListView
   */
  addGeneralTaskEvents() {

    const globalTab = document.querySelector('.global-list .item--right');

    globalTab.addEventListener('click', e => {

      if (e.target.classList.contains('tab__btn')) {

        const buttons = [...globalTab.querySelectorAll('.tab__btn')];
        buttons.forEach(btn => btn.classList.remove('tab__btn--active'));

        e.target.classList.add('tab__btn--active');
        const category = e.target.innerText.toLowerCase();
        eventBus.post('order-tasks', category);
      }
    });

    document.querySelector('.tab__item--global-btn').addEventListener('click', () => {

      const globalContainer = document.querySelector('.global-list__content');
      const globalContainerDone = document.querySelector('.global-list__content--done');
      const globalTabs = [...document.querySelectorAll('.tab__item--global')];
      const globalListIcon = document.querySelector('.tab__arrow');

      globalListIcon.classList.toggle('icon-arrow-right');
      globalListIcon.classList.toggle('icon-arrow-down');
      globalContainer.classList.toggle('d-none');
      globalContainerDone.classList.toggle('d-none');

      globalTabs.forEach((tab) => {
        tab.classList.toggle('d-none');
      });
    });
  }

  /**
   * @description appends tasks to global container
   * @param {object} arg contains current tasks and container for global tasks
   * @return {undefined}
   * @memberof TaskGlobalListView
   */
  renderTasks(arg) {
    const [tasks, container] = arg;
    container.innerHTML = '';

    if (!tasks) return;

    const fragment = document.createDocumentFragment();

    for (const [key] of Object.entries(tasks)) {
      if (tasks[key].tasks.length === 0) continue;

      const taskCategoryList = this.createContainerTitle(tasks[key].title);

      taskCategoryList.insertAdjacentHTML('beforeend',
        this.createTasksTemplate(tasks[key].tasks)
      );

      fragment.appendChild(taskCategoryList);
    }

    container.appendChild(fragment);
  }

  /**
   * @description creates template from task object
   * @param {object} tasks for render
   * @return {string} template
   * @memberof TaskGlobalListView
   */
  createTasksTemplate(tasks) {
    let taskFragment = '';

    tasks.forEach(task => {
      taskFragment += taskTemplate(task);
    });

    return taskFragment;
  }

  /**
   * @description creates title for tasks categories
   * @param {string} title task title
   * @return {string} template for render
   * @memberof TaskGlobalListView
   */
  createContainerTitle(title) {
    const taskCategoryList = document.createElement('div');
    taskCategoryList.classList.add('global-list__item');

    taskCategoryList.insertAdjacentHTML('afterbegin',
      `<h4 class="global-list__title global-list__title--${title}">${title}</h4>`
    );

    return taskCategoryList;
  }

  /**
   * @description renders daily tasks
   * @param {object} tasks for rendering
   * @memberof TaskDailyListView
   */
  renderDailyTasks(tasks) {

    const activeTasks = tasks.dailyActive;
    const completedTasks = tasks.dailyCompleted;
    const activeTasksContainer = document.querySelector('.daily-content__content');
    const completedTasksContainer = document.querySelector('.daily-content__content--done');

    if (activeTasks) {
      activeTasksContainer.innerHTML = '';

      activeTasks.forEach(task => {
        task.deadlineDate.month = 'today';
        task.deadlineDate.day = '';

        activeTasksContainer.insertAdjacentHTML('beforeend',
          taskTemplate(task)
        );
      });
    }

    if (completedTasks) {
      completedTasksContainer.innerHTML = '';

      completedTasks.forEach(task => {
        task.deadlineDate.month = 'today';
        task.deadlineDate.day = '';

        completedTasksContainer.insertAdjacentHTML('beforeend',
          taskTemplate(task)
        );
      });
    }

    this.addDailyTaskButtonsEvents(activeTasksContainer);
  }

  /**
   * @description adds event listeners for daily task buttons
   * @param {object} wrapper
   * @return {undefined} 
   * @memberof TaskGlobalListView
   */
  addDailyTaskButtonsEvents(wrapper) {

    const container = wrapper;
    const buttonsControls = [...container.querySelectorAll('.task__btn-wrapp')];
    const timerButtons = [...container.querySelectorAll('.task__estimation-btn')];

    buttonsControls.forEach(btn =>
      btn.addEventListener('click', e => {

        const id = e.currentTarget.parentElement.id;

        if (e.target.classList.contains('task__btn-edit')) {
          eventBus.post('edit-task', id);
        }

        if (e.target.classList.contains('task__btn-delete')) {
          eventBus.post('confirm-removing', [id]);
        }

        if (e.target.classList.contains('task__btn-up-task')) {
          eventBus.post('move-to-daily-list', e.currentTarget.parentElement.id);
        }
      })
    );

    timerButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.id;

        eventBus.post('start-task', id);
      });
    });
  }

  /**
   * @description hides tasks in global list depending on filter value
   * @param {object} arg containes tasks to hide and all tasks
   * @memberof TaskGlobalListView
   */
  orderTasks(arg) {
    const [tasksToHide, allTasks] = arg;

    if (allTasks) {
      allTasks.forEach(item => {
        const task = document.getElementById(item.id);
        task.classList.remove('task--hidden');
        task.parentElement.classList.remove('d-none');
      });
    }

    tasksToHide.forEach(elem => {
      const task = document.getElementById(elem.id);
      task.classList.add('task--hidden');
      const leftTasks = [...task.parentElement.children].filter(
        item => !item.classList.contains('task--hidden')
      );
      if (leftTasks.length <= 1) {
        task.parentElement.classList.add('d-none');
      }
    });
  }

  /**
   * @description renders delete mode
   * @memberof TasksListView
   */
  renderDeleteMode() {
    this.toggleSelectTabs();
    this.toggleDeleteButtons();
    this.addDeleteEvent();
  }

  /**
   * @description toggles active tabs
   * @memberof TasksListView
   */
  toggleSelectTabs() {
    const tabs = [...document.querySelectorAll('.tab__item--left')];
    tabs.forEach(tab => {
      tab.classList.toggle('tab--hidden');

      tab.addEventListener('click', e => {
        const elementClassList = e.target.classList;
        if (elementClassList.contains('tab__btn-select-daily-list')) {
          this.getCurrentTaskContainer(
            '.daily-content__content',
            '.daily-content__content--done',
            this.selectAllTasks
          );
        }

        if (elementClassList.contains('tab__btn-select-global-list')) {
          this.getCurrentTaskContainer(
            '.global-list__content',
            '.lobal-list__content--done',
            this.selectAllTasks
          );
        }

        if (elementClassList.contains('tab__btn-disselect-daily-list')) {
          this.getCurrentTaskContainer(
            '.daily-content__content',
            '.daily-content__content--done',
            this.deselectAllTasks
          );
        }

        if (elementClassList.contains('tab__btn-disselect-global-list')) {
          this.getCurrentTaskContainer(
            '.global-list__content',
            '.lobal-list__content--done',
            this.deselectAllTasks
          );
        }
      });
    });
  }

  /**
   * @description chooses container and calls callback
   * @param {string} containerActiveSelector
   * @param {string} containerDoneSelector
   * @param {function} method
   * @memberof TasksListView
   */
  getCurrentTaskContainer(containerActiveSelector, containerDoneSelector, handlerMethod) {
    let container;

    if (document.querySelector('.tab__btn-toDo')) {
      container = document.querySelector(containerActiveSelector);

    } else {
      container = document.querySelector(containerDoneSelector);
    }

    handlerMethod(container);
  }

  /**
   * @description deselects all tasks from delete
   * and emits custom event 'raise-counter'
   * @param {object} container current tasks container
   * @memberof TasksListView
   */
  deselectAllTasks(container) {
    [...container.querySelectorAll('.task')].forEach(task => {
      task.querySelector('.task__info-wrapper').classList.toggle('task__delete');
      task.querySelector('.task__info-wrapper').classList.toggle('task__close');
      task.classList.remove('checked');
    });

    eventBus.post('raise-counter');
  }

  /**
   * @description selects all tasks to delete
   * and emits custom event 'raise-counter'
   * @param {object} container current tasks container
   * @memberof TasksListView
   */
  selectAllTasks(container) {
    [...container.querySelectorAll('.task')].forEach(task => {
      task.querySelector('.task__info-wrapper').classList.toggle('task__delete');
      task.querySelector('.task__info-wrapper').classList.toggle('task__close');
      task.classList.add('checked');
    });

    eventBus.post('raise-counter');
  }

  /**
   * @description toggles icon trash on delete buttons
   * @memberof TasksListView
   */
  toggleDeleteButtons() {
    [...document.querySelectorAll('.task')].forEach(
      task => {
        task.classList.toggle('task--deleted');
        task.querySelector('.task__info-wrapper').classList.toggle('task__delete');
      }
    );
  }

  /**
   * @description adds delete event
   * @memberof TasksListView
   */
  addDeleteEvent() {
    [...document.querySelectorAll('.task--deleted')].forEach(task => {
      task.addEventListener('click', e =>
        this.toggleTaskToDelete(e.currentTarget)
      );
    });
  }

  /**
   * @description toggles active css class on current element
   * and emits custom event 'raise-counter'
   * @param {object} taskElem task element
   * @memberof TasksListView
   */
  toggleTaskToDelete(taskElem) {

    taskElem.querySelector('.task__info-wrapper').classList.toggle('task__delete');
    taskElem.querySelector('.task__info-wrapper').classList.toggle('task__close');
    taskElem.classList.toggle('checked');
    eventBus.post('raise-counter');
  }

  /**
   * @description renders all tasks done template
   * @memberof TaskDailyListView
   */
  renderAllTasksDoneMessage() {

    document.querySelector('.daily-content__content').innerHTML = allTasksDoneTemplate();
  }

  /**
   * @description renders no task left template
   * @memberof TaskDailyListView
   */
  renderNoTasksLeftMessage() {
    document.querySelector('.daily-content__content').innerHTML = noTasksLeftTemplate();
  }
}
