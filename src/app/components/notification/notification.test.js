/* eslint-disable no-undef */
import './notification';
jest.dontMock('jquery');
const $ = require('jquery');
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('notification', () => {
  beforeEach(() => {
    $('.notification').remove();
  });

  it('should remove notification after user clicks on close button', () => {
    const options = {
      type: 'success',
      text: 'I warn you!!!!',
      showTime: 1,
    };
    const notification = $(document).notification(options);

    jest.spyOn(notification, 'clearNotification');
    notification.showNotification();

    $('.notification--close').click();
    expect(notification.clearNotification).toBeCalled();
  });

  it('should remove notification after timer executes', () => {
    const options = {
      type: 'warning',
      text: 'I warn you!!!!',
      showTime: 1,
    };

    const notification = $(document).notification(options);

    jest.spyOn(notification, 'clearNotification');
    notification.showNotification();
    jest.advanceTimersByTime(1000);

    expect(notification.clearNotification).toBeCalled();
  });

  it('should render success notification', () => {
    const options = {
      type: 'success',
      text: 'Settings was successfully saved',
      showTime: 3,
    };
    $(document).notification(options);
    expect($('.notification').length).toBeTruthy();
  });

  it('should start call function after 3 seconds', () => {
    const options = {
      type: 'info',
      text: 'Good job!',
      showTime: 3,
    };
    $(document).notification(options);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);
  });

  it('should not call function after timer executes', () => {
    const options = {
      type: 'error',
      text: 'Oops!',
      showTime: 3,
    };
    $(document).notification(options);
    expect(setTimeout).not.toHaveBeenCalledTimes(1);
    expect(setTimeout).not.toHaveBeenLastCalledWith(expect.any(Function), 3000);
  });
});
