/* eslint-disable no-undef */
import { TasksListModel } from './scripts/tasksListModel';
import { settingsData } from '../../helpers/settingsData';
import allTasksDone from './template/all-tasks-done.hbs';
import emptyPage from './template/add-firts-task.hbs';
import firstPage from './template/firstPage.hbs';
import noDailyTasks from './template/task-added.hbs';
import noTasksLeft from './template/no-tasks.hbs';
import taskListContainer from './template/tasksList.hbs';
import { tasks } from './__mocks__/tasks';
import { tasksFiltered } from './__mocks__/tasksFiltered';
import { categories } from './__mocks__/categories';
import { objProto } from './__mocks__/objProto';
import { newTaskOptions } from './__mocks__/newTaskOptions';
import { TaskModel } from './__mocks__/taskModel';

const tasksListModel = new TasksListModel(settingsData);
tasksListModel.taskListCollection = tasks;

describe('rendering', () => {
    it('renders correctly allTasksDone', () => {
        const tree = JSON.stringify(allTasksDone());
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly emptyPage', () => {
        const tree = JSON.stringify(emptyPage());
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly firstPage', () => {
        const tree = JSON.stringify(firstPage(tasksListModel.taskListTemplateData));
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly noDailyTasks', () => {
        const tree = JSON.stringify(noDailyTasks());
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly noTasksLeft', () => {
        const tree = JSON.stringify(noTasksLeft());
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly taskListContainer', () => {
        const tree = JSON.stringify(
            taskListContainer(tasksListModel.taskListTemplateData)
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('createTaskListCollection', () => {
    it('should create task-list', () => {
        tasksListModel.createTaskListCollection();
        expect(tasksListModel.tasksCollection).toEqual(tasksFiltered);
    });
});

describe('createCategories', () => {
    it('should create categories', () => {
        const res = tasksListModel.createCategories([tasks[0]], objProto);
        expect(res).toEqual(categories);
    });

    it('should return falsy result', () => {
        const res = tasksListModel.createCategories([tasks[0]]);
        expect(res).toBeFalsy();
    });

    it('should return falsy result', () => {
        const res = tasksListModel.createCategories();
        expect(res).toBeFalsy();
    });

    it('should return falsy result', () => {
        const res = tasksListModel.createCategories('test', true);
        expect(res).toBeFalsy();
    });
});

describe('createNewTask', () => {
    it('should create new task', () => {
        jest.spyOn(tasksListModel, 'createTaskListCollection');
        jest.spyOn(tasksListModel, 'sendTaskData');

        const res = new TaskModel(newTaskOptions);
        tasksListModel.createNewTask(newTaskOptions);

        expect(
            tasksListModel.taskListCollection[
            tasksListModel.taskListCollection.length - 1
            ]
        ).toMatchObject(res.options);
        expect(tasksListModel.createTaskListCollection).toBeCalled();
        expect(tasksListModel.sendTaskData).toBeCalled();
    });

    it('should return falsy result', () => {
        const res = tasksListModel.createNewTask();
        expect(res).toBeFalsy();
    });

    it('should return falsy result', () => {
        const res = tasksListModel.createNewTask(2343434);
        expect(res).toBeFalsy();
    });

    it('should return falsy result', () => {
        const res = tasksListModel.createNewTask(true);
        expect(res).toBeFalsy();
    });
});

describe('getCurrentDate', () => {
    it('should return current day obj', () => {
        const res = tasksListModel.getCurrentDate();
        expect(res).toBeTruthy();
    });

    it('should return day obj', () => {
        const today = new Date(2022, 2, 26);
        const options = {
            month: 'long',
        };
        const newDate = {
            fullDeadline: today.getTime(),
            month: Intl.DateTimeFormat('en-US', options).format(today),
            day: today.getDate(),
        };

        const res = tasksListModel.getCurrentDate('March 26, 2022');
        expect(newDate).toEqual(res);
    });

    it('should return current day obj', () => {
        const res = tasksListModel.getCurrentDate(true);
        expect(res).toBeTruthy();
    });

    it('should return current day obj', () => {
        const res = tasksListModel.getCurrentDate('');
        expect(res).toBeTruthy();
    });
});

describe('updateTask', () => {
    it('should update current task', () => {
        jest.spyOn(tasksListModel, 'createTaskListCollection');
        jest.spyOn(tasksListModel, 'sendTaskData');

        const newTask = tasks[1];
        const newDescription = 'Wow! This is the greatest test ever!!!';
        newTask.description = newDescription;
        tasksListModel.updateTask(newTask);
        const updatedTask = tasksListModel.taskListCollection.find(
            item => item.id === newTask.id
        );
        expect(updatedTask.description).toBe(newDescription);
        expect(tasksListModel.createTaskListCollection).toBeCalled();
        expect(tasksListModel.sendTaskData).toHaveBeenCalledWith(
            'tasks',
            newTask,
            newTask.id
        );
    });

    it('should return falsy value', () => {
        const res = tasksListModel.updateTask();
        expect(res).toBeFalsy();
    });
});

describe('changeTaskStatus', () => {
    it('should change task status', () => {
        jest.spyOn(tasksListModel.settingsData, 'sendData');

        const id = tasks[0].id;
        const newStatus = 'TEST';
        tasksListModel.changeTaskStatus(id, newStatus);
        const updatedTask = tasksListModel.taskListCollection.find(
            item => item.id === id
        );
        expect(updatedTask.status).toBe(newStatus);
        expect(tasksListModel.settingsData.sendData).toHaveBeenCalledWith(
            'tasks',
            updatedTask,
            id
        );
    });

    it('should return falsy value', () => {
        const res = tasksListModel.changeTaskStatus();
        expect(res).toBeFalsy();
    });
});

describe('changeTaskStatus', () => {
    it('should change task status', () => {
        jest.spyOn(tasksListModel.settingsData, 'removeItem');
        jest.spyOn(tasksListModel.renderNoTasksLeftPageEvent, 'notify');

        const idsToRemove = [];
        tasksListModel.taskListCollection.forEach(task => idsToRemove.push(task.id));
        tasksListModel.removeTask(idsToRemove);
        expect(tasksListModel.taskListCollection.length).toBeFalsy();
        expect(tasksListModel.settingsData.removeItem).toHaveBeenCalledWith(
            'tasks',
            idsToRemove
        );
        expect(tasksListModel.renderNoTasksLeftPageEvent.notify).toBeCalled();
    });

    it('should return falsy value', () => {
        const res = tasksListModel.removeTask();
        expect(res).toBeFalsy();
    });
});

describe('checkLeftTasks', () => {
    it('should call appropriate func', () => {
        jest.spyOn(tasksListModel.renderNoTasksLeftPageEvent, 'notify');

        tasksListModel.checkLeftTasks();
        expect(tasksListModel.renderNoTasksLeftPageEvent.notify).toBeCalled();
    });

    it('should call appropriate func', () => {
        jest.spyOn(tasksListModel.renderEmptyDailyTasks, 'notify');

        tasksListModel.taskListCollection.length = 1;
        tasksListModel.globalTasksActive.length = 1;
        tasksListModel.checkLeftTasks();
        expect(tasksListModel.renderEmptyDailyTasks.notify).toBeCalled();
    });

    it('should call appropriate func', () => {
        jest.spyOn(tasksListModel.renderAddFirstTaskPageEvent, 'notify');

        tasksListModel.taskListCollection.length = 1;
        tasksListModel.globalTasksActive.length = 0;
        tasksListModel.dailyTasksActive.length = 0;
        tasksListModel.dailyTasksCompleted.length = 0;
        tasksListModel.globalTasksCompleted.length = 0;

        tasksListModel.checkLeftTasks();
        expect(tasksListModel.renderAddFirstTaskPageEvent.notify).toBeCalled();
    });

    it('should call appropriate func', () => {
        jest.spyOn(tasksListModel.renderNoTasksLeftPageEvent, 'notify');

        tasksListModel.taskListCollection.length = 1;
        tasksListModel.globalTasksActive.length = 0;
        tasksListModel.dailyTasksActive.length = 0;
        tasksListModel.dailyTasksCompleted.length = 1;
        tasksListModel.globalTasksCompleted.length = 1;

        tasksListModel.checkLeftTasks();
        expect(tasksListModel.renderNoTasksLeftPageEvent.notify).toBeCalled();
    });
});

describe('getTaskById', () => {
    beforeAll(() => {
        tasksListModel.taskListCollection = tasks;
    });
    it('should return task by id', () => {
        const res = tasksListModel.getTaskById(tasks[0].id);
        expect(res).toEqual(tasks[0]);
    });

    it('should return falsy value', () => {
        const res = tasksListModel.getTaskById();
        expect(res).toBeFalsy();
    });
});

describe('saveTaskToStorage', () => {
    beforeAll(() => {
        tasksListModel.taskListCollection = tasks;
    });
    it('should call func to set value to storage', () => {
        jest.spyOn(tasksListModel.settingsData, 'setDataToStorage');
        tasksListModel.saveTaskToStorage(tasks[0].id);
        expect(tasksListModel.settingsData.setDataToStorage).toHaveBeenCalledWith(
            'active-task',
            tasks[0]
        );
    });

    it('should return falsy value', () => {
        const res = tasksListModel.saveTaskToStorage();
        expect(res).toBeFalsy();
    });
});
