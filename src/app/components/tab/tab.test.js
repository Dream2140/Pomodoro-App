/* eslint-disable no-undef */

import checkActiveState from './template/checkActiveState';

describe('checkActiveState', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      location: {
        pathname: '/reports/day/tasks',
      },
    }));
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it('should return active css class when period parameter is seted', () => {
    const result = checkActiveState('day', 'day');
    expect(result).toBe('tab__btn--active');
  });

  it('should return active css class with seted only value parameter', () => {
    const result = checkActiveState('', 'tasks');
    expect(result).toBe('tab__btn--active');
  });

  it('should return falsy result', () => {
    const result = checkActiveState('', '');
    expect(result).toBeFalsy();
  });
});
