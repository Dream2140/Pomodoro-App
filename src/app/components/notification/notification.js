import notificationTemplate from './template/notification.hbs';
import './styles/notification.less';
/* eslint-disable no-undef */
import $ from 'jquery';
global.$ = global.jQuery = $;
/* eslint-disable no-undef */

const MILLISECONDS_IN_MINUTE = 1000;

(function ($) {
  let activeTimers = [];

  /**
   * @description notification plugin
   * @param {object | string} options
   * @return {object}
   */
  $.fn.notification = function (options) {
    const defaults = {
      type: 'info',
      text: '',
      showTime: null,
      notificationTemplate
    };

    const settings = $.extend({}, defaults, options);

    /**
     * @description emits remove function if plugin options equals string 'clean'
     * else clears all timers, shows current notification
     * @return {object}
     */
    this.initNotification = function () {
      if (options === 'clean') {
        $('.notification').remove();
      } else {
        this.clearTimers().showNotification();
      }

      return this;
    };

    /**
     * @description clears active timers
     * @return {object}
     */
    this.clearTimers = function () {
      activeTimers = activeTimers.map(timer => {
        clearTimeout(timer);
        timer = 0;

        return timer;
      });

      return this;
    };

    /**
     * @description renders notification, starts timer
     * and removes notification after it expiration
     * @return {object}
     */
    this.showNotification = function () { 
      const delay = settings.showTime * MILLISECONDS_IN_MINUTE;

      $(this)[0].body.insertAdjacentHTML(
        'beforeend',
        settings.notificationTemplate({
          type: settings.type,
          text: settings.text
        })
      );

      $('.notification--close').on('click', this.clearNotification);

      if (settings.type !== 'error') {
        const timeoutId = setTimeout(this.clearNotification, delay);
        activeTimers.push(timeoutId);
      }

      return this;
    };

    /**
     * @description removes notification with fadeout jquery animation
     * @return {object}
     */
    this.clearNotification = function () {
      $('.notification').fadeOut(400, $('.notification').remove);

      return this;
    };

    return this.initNotification();
  };
})(jQuery);