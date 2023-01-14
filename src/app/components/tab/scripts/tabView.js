import { eventBus } from '../../../helpers/eventBus';

/**
 * @description manages tab view
 * @exports TabView
 * @class TabView
 */
export class TabView {
  constructor(model) {
    this.model = model;

    eventBus.subscribe('pageLoaded', () => {
      this.addTabEvents();
    });

  }

  addTabEvents() {
    const tabs = [...document.querySelectorAll('.tab__btn')];

    tabs.forEach(tab => {
      tab.addEventListener('click', e => this.toggleActiveState(e.target));
    });
  }

  /**
   * @description toggles active state of tabs` buttons
   * @param {object} elem current element which fires event
   * @memberof TabView
   */
  toggleActiveState(elem) {
    const tabs = [...elem.parentElement.querySelectorAll('.tab__btn')];

    tabs.forEach(tab => {
      tab?.classList?.remove('tab__btn--active');
    });

    elem.classList.add('tab__btn--active');
  }

}