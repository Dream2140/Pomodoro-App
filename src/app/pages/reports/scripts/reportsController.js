import { eventBus } from '../../../helpers/eventBus';

/**
 * @description controls events on report component
 * @exports ReportController
 * @class ReportController
 */

export class ReportsController {

    /**
   * @description Creates an instance of ReportController
   * @param {*} model instance of ReportModel
   * @param {*} view instance of ReportView
   * @memberof ReportController
   */
    constructor(view, model) {
        this.view = view;
        this.model = model;

        eventBus.subscribe('reports-day-tasks-loading', async () => {
            try {
                await this.model.createPage('tasks', 'day');
                eventBus.post('pageLoaded');
            } catch (err) {
                console.error(err.message);
            }

        });

        eventBus.subscribe('reports-day-pomodoros-loading', async () => {
            try {
                await this.model.createPage('pomodoros', 'day');
                eventBus.post('pageLoaded');
            } catch (err) {
                console.error(err.message);
            }

        });

        eventBus.subscribe('reports-week-tasks-loading', async () => {
            try {
                await this.model.createPage('tasks', 'week');
                eventBus.post('pageLoaded');
            } catch (err) {
                console.error(err.message);
            }

        });

        eventBus.subscribe('reports-week-pomodoros-lodaing', async () => {
            try {
                await this.model.createPage('pomodoros', 'week');
                eventBus.post('pageLoaded');
            } catch (err) {
                console.error(err.message);
            }

        });

        eventBus.subscribe('reports-month-tasks-loading', async () => {
            try {
                await this.model.createPage('tasks', 'month');
                eventBus.post('pageLoaded');
            } catch (err) {
                console.error(err.message);
            }

        });

        eventBus.subscribe('reports-month-pomodoros-loading', async () => {
            try {
                await this.model.createPage('pomodoros', 'month');
                eventBus.post('pageLoaded');
            } catch (err) {
                console.error(err.message);
            }
        });
    }
}