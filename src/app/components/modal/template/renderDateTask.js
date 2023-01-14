import $ from 'jquery';

/**
 * @description returns date in format 'MM d, yy'
 * @exports renderDateTask
 * @param {string} date current date
 * @return {string} date in format 'MM d, yy'
 */
export default function () {
    return $.datepicker.formatDate('MM d, yy', new Date());
  }
  