/* eslint-disable no-undef */
import reports from './template/reports.hbs';
import { ReportsModel } from './scripts/reportsModel';
import { tasks } from './__mocks__/tasksReport';
import { tabsData } from './__mocks__/tabsData';
import { dataForPomodorosReport } from './__mocks__/dataForPomodorosReport';
import { dataForTasksReport } from './__mocks__/dataForTasksReport';

jest.mock('./scripts/reportsView.js');
jest.mock('../../helpers/settingsData');

const reportsModel = new ReportsModel();

describe('check report rendering', () => {
  it('renders correctly report', () => {
    const tree = JSON.stringify(reports(tabsData));
    expect(tree).toMatchSnapshot();
  });
});

describe('createReport', () => {
  beforeEach(() => {
    reportsModel.tasks = tasks;
    jest.spyOn(reportsModel, 'sortReportsByPeriod');
    jest.spyOn(reportsModel, 'createReportsData');
  });

  it('shold start creating reports', () => {
    reportsModel.createReport('tasks', 1, 'day');
    expect(reportsModel.sortReportsByPeriod).toBeCalled();
    expect(reportsModel.createReportsData).toBeCalled();
  });

  it('shold not start creating reports', () => {
    reportsModel.createReport('tasks');
    expect(reportsModel.sortReportsByPeriod).not.toBeCalled();
    expect(reportsModel.createReportsData).not.toBeCalled();
  });
});

describe('should sort tasks', () => {
  it('shold sort reports for 1 day', () => {
    const result = reportsModel.sortReportsByPeriod(tasks, 1);
    expect(result).toEqual(tasks);
  });

  it('shold sort reports for 7 weeks', () => {
    const result = reportsModel.sortReportsByPeriod(tasks, 7);
    expect(result).toEqual(tasks);
  });

  it('shold return falsy result', () => {
    const result = reportsModel.sortReportsByPeriod(true, 7);
    expect(result).toBeFalsy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.sortReportsByPeriod(true, 0);
    expect(result).toBeFalsy();
  });
});

describe('should create data for pomodoros', () => {
  it('shold return data for pomodoros report', () => {
    const result = reportsModel.createDataPomodoros(tasks);
    expect(result).toEqual(dataForPomodorosReport);
  });

  it('shold return falsy result', () => {
    const result = reportsModel.createDataPomodoros();
    expect(result).toBeFalsy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.createDataPomodoros([]);
    expect(result).toBeFalsy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.createDataPomodoros(67);
    expect(result).toBeFalsy();
  });
});

describe('should create data for tasks report', () => {
  it('shold return data for tasks report', () => {
    const result = reportsModel.createDataTasks(tasks);
    expect(result).toEqual(dataForTasksReport);
  });

  it('shold return falsy result', () => {
    const result = reportsModel.createDataTasks([]);
    expect(result).toBeFalsy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.createDataTasks();
    expect(result).toBeFalsy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.createDataTasks(6);
    expect(result).toBeFalsy();
  });
});

describe('should check if task successfull', () => {
  it('shold return truthy result', () => {
    const result = reportsModel.isSuccessfullTask(tasks[1]);
    expect(result).toBeTruthy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.isSuccessfullTask(tasks[0]);
    expect(result).toBeFalsy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.isSuccessfullTask();
    expect(result).toBeFalsy();
  });

  it('shold return falsy result', () => {
    const result = reportsModel.isSuccessfullTask(6);
    expect(result).toBeFalsy();
  });
});
