import {
  eventBus
} from '../../../helpers/eventBus';
import * as confirmationTemplate from '../template/confirmModal.hbs';
import * as modalTemplate from '../template/modal.hbs';
import * as authModalTemplate from '../template/authModal.hbs';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';

/**
 * @exports ModalView
 * @description manages modal events and view
 * @class ModalView
 */
export class ModalView {

  /**
   * @description Creates an instance of ModalView
   * @memberof SettingsView
   */
  constructor() {

    eventBus.subscribe('open-modal', info => this.renderModal(info));

    eventBus.subscribe('confirm-removing', ids => {
      this.renderConfirmationPopup(ids);
    });

    eventBus.subscribe('close-modal', () => {
      this.closeModal();
    });

    eventBus.subscribe('auth-modal', () => {
      this.renderAuthModal();
    });
  }

  /**
   * @description renders modal and adds events
   * @param {string} [info=''] information about the task, if this is a new task,
   * the info field is empty
   * @memberof ModalView
   */
  renderModal(info = '') {
    document.body.insertAdjacentHTML('afterbegin', modalTemplate(info));
    document.querySelector('.modal').scrollIntoView();

    this.addCloseEvents();

    $('#deadline').datepicker({
      dateFormat: 'MM d, yy'
    });

    if (info) {
      this.addUpdateTaskEvent(info);
    } else {
      this.addCreateTaskEvent();
    }
  }

  /**
   * @description adding a modal close event for the close button and for the overlay
   * @memberof ModalView
   */
  addCloseEvents() {
    document
      .querySelector('.modal__btn-close').addEventListener('click', () => {
        this.closeModal();
      });

    document.querySelector('.modal__overlay').addEventListener('click', () => {
      this.closeModal();
    });
  }

  /**
   * @description adding modal close event
   * @memberof ModalView
   */
  closeModal() {

    const elementModalWindow = document.querySelector('.modal');
    const parentEl = elementModalWindow.parentElement;

    parentEl.removeChild(elementModalWindow);
  }

  /**
   * @description manages editing of task
   * @param {object} task object with task properties
   * @memberof ModalView
   */
  addUpdateTaskEvent(task) {

    document.querySelector('.modal__btn-add').addEventListener('click', () => {

      const form = new FormData(document.querySelector('.modal__form'));
      const title = form.get('title');
      const description = form.get('description');

      if (this.validateTextField(title) && this.validateTextField(description)) {

        const newTask = {
          ...task,
          title: title,
          description: description,
          deadline: form.get('deadline'),
          categoryId: form.get('category'),
          estimation: form.get('estimation'),
          priority: form.get('priority')
        };
        console.log(newTask);
        eventBus.post('update-task', newTask);
      }
    });
  }

  /**
   * @description manages data for new task
   * @memberof ModalView
   */
  addCreateTaskEvent() {
    document.querySelector('.modal__btn-add').addEventListener('click', () => {

      const form = new FormData(document.querySelector('.modal__form'));
      const title = form.get('title');
      const description = form.get('description');

      if (this.validateTextField(title) && this.validateTextField(description)) {

        const options = {
          title: title,
          description: description,
          deadline: form.get('deadline'),
          categoryId: form.get('category'),
          estimation: form.get('estimation'),
          priority: form.get('priority')
        };
        console.log(options);
        eventBus.post('create-task', options);
      }
    });

    document.getElementById('title').focus();
  }

  /**
   * @description validates text of task title and description
   * @param {string} value
   * @return {boolean}
   * @memberof ModalView
   */
  validateTextField(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return false;
    }

    return true;
  }

  /**
   * @description renders confirmation popup and adds events for closing and deleting tasks
   * @param {object} ids an object with ids of tasks to delete
   * @memberof ModalView
   */
  renderConfirmationPopup(ids) {
    if (Array.isArray(ids) && ids.length) {
      document.body.insertAdjacentHTML('afterbegin', confirmationTemplate());
      document.querySelector('.modal').scrollIntoView();

      this.addCloseEvents();

      document.querySelector('.service-btn__btn-remove-task').addEventListener('click', () => {

        eventBus.post('remove-task', ids);
      });

      document.querySelector('.service-btn__btn-close').addEventListener('click', () => {

        this.closeModal();
      });
    }
  }

  renderAuthModal(){
    document.body.insertAdjacentHTML('afterbegin', authModalTemplate());
  }
}