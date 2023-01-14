/**
 * @description Helper Functions
 * @exports Helpers
 * @class Helpers
 */
export class Helpers {

  /**
   * @description sorts object in special key order
   * for rendering buttons template in settings component
   * @param {object} obj
   * @return {object} ordered object
   * @memberof Helpers
   */
  static sortObjectByKeys(obj) {
    const ordered = {};
    const keysOrder = ['work', 'iteration', 'shortBreak', 'longBreak'];

    keysOrder.forEach(item => {
      Object.keys(obj).forEach(key => {
        if (key === item) {
          ordered[key] = obj[key];
        }
      });
    });

    return ordered;
  }

  /**
   * @description checks if it is a new user
   * @return {undefined}
   * @memberof Helpers
   */
  static firstSession() {
    const flag = JSON.parse(sessionStorage.getItem('isNewUser'));
    
    if (flag === null) {
      sessionStorage.setItem('isNewUser', true);
    } else if (!flag) {
      return;
    } else {
      sessionStorage.setItem('isNewUser', false);
    }
  }

  /**
   * @description creates object for tasks
   * @return {object} empty with task categories
   * @memberof Helpers
   */
  static createCategoriesObj() {
    const taskCategoriesProto = {
      work: {},
      education: {},
      hobby: {},
      sport: {},
      other: {}
    };

    return taskCategoriesProto;
  }

  /**
   * @description generate unique id for task
   * @return {string} unique id 
   * @memberof Helpers
   */
  static generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * @description transforms date into format 'MM-dd-YY'
   * @param {object} date current date
   * @return {string} date in format 'MM-dd-YY'
   * @memberof Helpers
   */
  static getCurrentDate(date) {
    let currentDate = date ? new Date(date) : new Date();
    
    return `${currentDate.getMonth() < 9
      ? '0' + (currentDate.getMonth() + 1)
      : currentDate.getMonth() + 1
      }-${currentDate.getDate() < 10
        ? '0' + currentDate.getDate()
        : currentDate.getDate()
      }-${currentDate
        .getFullYear()
        .toString()
        .slice(-2)}`;
  }

  /**
   * @description returns list of month days
   * @return {object}
   * @memberof Helpers
   */
  static getNumberDate(date) {

    const dateLength = 8,
      startIndexOfYear = 6,
      startIndexOfMonth = 0,
      endIndexOfMonth = 3,
      startIndexOfDay = 3,
      endIndexOfDay = 5,
      TWO_THOUSANDS_YEARS = 2000;

    if (!date || date.length !== dateLength) {
      return;
    }

    const year = parseInt(date.substring(startIndexOfYear), 10) + TWO_THOUSANDS_YEARS;
    const month = parseInt(date.substring(startIndexOfMonth, endIndexOfMonth), 10) -1 ;
    const day = parseInt(date.substring(startIndexOfDay, endIndexOfDay), 10);
    const result = new Date(year, month, day);
    
    return result;

  }

  static getMonthDays() {
    const DAYS_IN_MONTH = 30;
    const monthDaysList = [];

    for (let i = 1; i <= DAYS_IN_MONTH; i++) {
      monthDaysList.push(i);
    }

    return monthDaysList;
  }

  /**
  * @description returns list of weekdays
  * @return {object}
  * @memberof Helpers
  */
  static getWeekDays() {
    const DAYS_IN_WEEK = 7;
    const MILLISECONDS_IN_DAY = 86400000;
    const weekDaysList = [];
    const currentDate = new Date();
    let currentTime = currentDate.getTime();
    const options = {
      weekday: 'short'
    };

    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      weekDaysList.push(
        Intl.DateTimeFormat('en-US', options).format(currentDate)
      );
      currentTime -= MILLISECONDS_IN_DAY;
      currentDate.setTime(currentTime);
    }

    return weekDaysList.reverse();
  }

  /**
   * @description returns current week day by date
   * @param {object} date
   * @return {string} week day
   * @memberof Helpers
   */
  static getCurrentWeekDayByDate(date) {
    const currentDate = Helpers.getNumberDate(date);
    if (!currentDate) {
      return;
    }
    const options = {
      weekday: 'short'
    };

    return Intl.DateTimeFormat('en-US', options).format(currentDate);
  }

  /**
   * @description returns day index by date
   * @param {string} date
   * @return {number} index from 30 to 1
   * @memberof Helpers
   */
  static getCurrentMonthDayByDate(date) {
    const currentDayDate = Helpers.getNumberDate(date);
    if (!currentDayDate) {
      return;
    }
    const currentDate = new Date();
    const MILLISECONDS_IN_DAY = 86400000;
    const DAYS_IN_MONTH = 30;
    let currentDayIndex = 30;

    const difference = currentDate.getTime() - currentDayDate.getTime();

    if (difference > MILLISECONDS_IN_DAY) {
      currentDayIndex =
        DAYS_IN_MONTH - Math.floor(difference / MILLISECONDS_IN_DAY);
    }

    return currentDayIndex;
  }


}
