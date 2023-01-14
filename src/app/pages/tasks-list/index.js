import { TasksListController } from './scripts/tasksListController';
import { TasksListModel } from './scripts/tasksListModel';
import { TasksListView } from './scripts/tasksListView';
import './styles/tasks-list.less';
const tasksListModel = new TasksListModel();
const tasksListView = new TasksListView(tasksListModel);

/* eslint-disable no-unused-vars */
const tasksListController = new TasksListController(tasksListView, tasksListModel);
/* eslint-disable no-unused-vars */