/* eslint-disable no-undef */
import { TimerModel } from './scripts/timerModel';
import { tasks } from '../tasks-list/__mocks__/tasks';
import timerTemplate from './template/timer.hbs';
import startTaskBtn from './template/startTaskBtn.hbs';
import createPomodoros from './template/createPomodoros';
import { pomodoroSettings } from './__mocks__/pomodoroSettings';
import { activeTask } from './__mocks__/activeTask';
import { startTaskBtnSettings } from './__mocks__/startTaskBtnSettings';


const timerModel = new TimerModel();
timerModel.pomodoroSettings = pomodoroSettings;
timerModel.activeTask = activeTask;

describe('Test correct rendering', () => {

    it('renders timer template', () => {
        const tree = JSON.stringify(timerTemplate(tasks[0]));
        expect(tree).toMatchSnapshot();
    });

    it('renders start task button', () => {
        const tree = JSON.stringify(startTaskBtn(startTaskBtnSettings));
        expect(tree).toMatchSnapshot();
    });
});

describe('createPomodoros', () => {
    it('should create two pomodoros template', () => {
        const res = createPomodoros('2');
        const pomodorosTemplate = '<span class="estimation__item"></span><span class="estimation__item">';
        expect(res).toMatchSnapshot(pomodorosTemplate);
    });

    it('should return falsy value', () => {
        const res = createPomodoros();
        expect(res).toBeFalsy();
    });

    it('should return falsy value', () => {
        const res = createPomodoros('');
        expect(res).toBeFalsy();
    });
});

describe('Get data from storage', () => {
    beforeEach(() => {
        jest.spyOn(timerModel.settingsData, 'getDataFromStorage');
      });

    it('should get data from storage', () => {
        timerModel.getDataFromStorage('active-task');
        expect(timerModel.settingsData.getDataFromStorage).toHaveBeenCalledWith(
            'active-task'
        );
    });

    it('should return falsy value', () => {
        const res = timerModel.getDataFromStorage();
        expect(timerModel.settingsData.getDataFromStorage).not.toBeCalled();
        expect(res).toBeFalsy();
    });

    it('should return falsy value', () => {
        const res = timerModel.getDataFromStorage(23425);
        expect(timerModel.settingsData.getDataFromStorage).not.toBeCalled();
        expect(res).toBeFalsy();
    });
});