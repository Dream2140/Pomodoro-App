/* eslint-disable no-undef */
import { Helpers } from './helpers';

it('should return date in format `MM-dd-YY`', () => {
  const date = new Date(2022, 3, 25);
  const result = Helpers.getCurrentDate(date.getTime());
  expect(result).toBe('04-25-22');
});

it('should return not valid data', () => {
  const result = Helpers.getCurrentDate(null);
  const truthyResult = Helpers.getCurrentDate(new Date());

  expect(result).toBe(truthyResult);
});

it('should return empty obj with predefined keys', () => {
  const resultObj = {
    work: {},
    education: {},
    hobby: {},
    sport: {},
    other: {},
  };
  const result = Helpers.createCategoriesObj();

  expect(result).toEqual(resultObj);
});

it('should return ordered obj with predefined keys', () => {
  const resultObj = {
    work: {},
    iteration: {},
    shortBreak: {},
    longBreak: {},
  };
  const objToCheck = {
    longBreak: {},
    shortBreak: {},
    iteration: {},
    work: {},
  };
  const result = Helpers.sortObjectByKeys(objToCheck);

  expect(result).toEqual(resultObj);
});

it('should return week days from today', () => {
  const today = Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(new Date());

  const result = Helpers.getWeekDays();

  expect(result[result.length - 1]).toBe(today);
});

it('should return array with numbers from 1 to 30', () => {
  const result = Helpers.getMonthDays();

  expect(result[result.length - 1]).toBe(30);
  expect(result[0]).toBe(1);
  expect(result[15]).toBe(16);
});

it('should return date object in format `MM-dd-YY`', () => {
  const result = Helpers.getNumberDate('04-29-22');
  const truthyResult = new Date(2022, 3, 29);
  const falthyResult = new Date();

  expect(result).toStrictEqual(truthyResult);
  expect(result).not.toStrictEqual(falthyResult);
});


it('should return current day of the week', () => {
  const result = Helpers.getCurrentWeekDayByDate('02-02-20');
  const truthyResult = Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(new Date(2020, 1, 2));

  expect(result).toBe(truthyResult);
  expect(result).not.toBe(undefined);
});

it('should return undefined', () => {
  const result = Helpers.getCurrentWeekDayByDate(null);

  expect(result).toBe(undefined);
});

it('should return month day by date', () => {
  const result = Helpers.getCurrentMonthDayByDate('06-12-22');

  expect(typeof result).toBe('number');
});
