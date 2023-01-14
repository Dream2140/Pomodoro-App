/* eslint-disable no-undef */
import { settingsData } from './__mocks__/settingsData';
import { buttonsValues } from './__mocks__/buttonsValues';
import settingsTemplate from './template/settings.hbs';
import categoriesTemplate from './template/settingsCategories.hbs';

import { SettingsModel } from './scripts/settingsModel';
import { allSettingsData } from './__mocks__/allSettingsData';
import { fullCycleTime } from './__mocks__/fullCycleTime';
import { firstCycleTime } from './__mocks__/firstCycleTime';

const settingsModel = new SettingsModel();

describe('rendering', () => {
  it('renders correctly page', () => {
    const tree = JSON.stringify(settingsTemplate(settingsData));
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly categories', () => {
    const tree = JSON.stringify(
      categoriesTemplate({
        tab: {
          firstVal: 'pomodoros',
          secondVal: 'categories',
          activeTab: true,
          firstValAttr: 'data-tab="pomodoros"',
          secondValAttr: 'data-tab="categories"',
        },
      })
    );
    expect(tree).toMatchSnapshot();
  });
});


describe('getting settings data', () => {
  beforeEach(() => {
    settingsModel.buttonsValues = buttonsValues;
  });
  it('should return settings data', () => {
    const result = settingsModel.getAllSettingsData();
    expect(result).toEqual(allSettingsData);
  });

  it('should return full cycle time data', () => {
    const result = settingsModel.getFullCycleTime();
    expect(result).toEqual(fullCycleTime);
  });

  it('should return first cycle time data', () => {
    const result = settingsModel.getFirstCycleTime();
    expect(result).toEqual(firstCycleTime);
  });
});

describe('increasing/decreasing values', () => {
  beforeEach(() => {
    settingsModel.buttonsValues = buttonsValues;
    jest.spyOn(settingsModel, 'setValue');
  });

  it('should call set button value func', () => {
    settingsModel.increaseValue(['longBreak', 20]);
    expect(settingsModel.setValue).toBeCalled();
    expect(settingsModel.setValue).toHaveBeenCalledTimes(1);
  });

  it('should call set button value func', () => {
    settingsModel.decreaseValue(['shortBreak', 5]);
    expect(settingsModel.setValue).toBeCalled();
    expect(settingsModel.setValue).toHaveBeenCalledTimes(1);
  });

  it('should not call set button value func', () => {
    const result = settingsModel.decreaseValue([3456, 5]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  it('should not call set button value func', () => {
    const result = settingsModel.decreaseValue([true, false]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  it('should not call set button value func', () => {
    const result = settingsModel.decreaseValue();
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  it('should not call set button value func', () => {
    const result = settingsModel.increaseValue([3456, 5]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  it('should not call set button value func', () => {
    const result = settingsModel.increaseValue([true, false]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  it('should not call set button value func', () => {
    const result = settingsModel.increaseValue();
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });
});

describe('setting values', () => {
  beforeEach(() => {
    settingsModel.buttonsValues = buttonsValues;
  });

  it('should set button value', () => {
    const arg = ['work', 25];
    const [id, currentValue] = arg;
    const newValue = currentValue - settingsModel.buttonsValues[id].step;

    settingsModel.setValue(id, newValue);
    expect(settingsModel.buttonsValues[id].value).toBe(newValue);
  });

  it('should not set button value', () => {
    settingsModel.setValue('work', 45);
    expect(settingsModel.buttonsValues['work'].value).toBe(20);
  });

  it('should return falsy value', () => {
    const res = settingsModel.setValue(34, 56);
    expect(res).toBeFalsy();
  });

  it('should return falsy value', () => {
    const res = settingsModel.setValue();
    expect(res).toBeFalsy();
  });
});
