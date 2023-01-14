import { eventBus } from '../../../helpers/eventBus';
import * as cycleTemplate from '../template/cycle.hbs';
import * as cycleBottom from '../template/cycleBottom.hbs';
import * as cycleLine from '../template/cycleLine.hbs';
import * as settingsTemplate from '../template/settings.hbs';
import * as settingsCategories from '../template/settingsCategories.hbs';
import { router } from '../../../routes';

/**
 * @description manages settings view
 * @exports SettingsView
 * @class SettingsView
 */
export class SettingsView {

    /**
     * @description Creates an instance of SettingsView
     * @param {object} model instance of SettingsModel
     * @memberof SettingsView
     */
    constructor(model) {
        this.model = model;
        this.template = settingsTemplate;
        this.cycleTemplate = cycleTemplate;
        this.cycleLine = cycleLine;
        this.cycleBottom = cycleBottom;
        this.settingsCategories = settingsCategories;

        this.model.changeButtonsEvent.subscribe(
            this.renderSettingsElement.bind(this)
        );

        eventBus.subscribe('renderSettingsPage', () => {
            this.initializeSettingPage();
            this.addSettingsPageEvents();
            this.activateSettingsTabs();

            eventBus.post('pageLoaded');
        });

        eventBus.subscribe('settings-category-page-loading', () => {
            this.initializeCategoriesPage();
            this.addSettingsPageEvents();
            this.activateSettingsTabs();
            this.addCategoriesPageEvents();

            eventBus.post('pageLoaded');
        });

        window.addEventListener('resize', () => {
            const currentRoute = window.location.pathname;

            if (/^\/settings/.test(currentRoute)) {
                eventBus.post('load-page');
            }
        });
    }

    /**
     * @description add events listners for categories page
     * @memberof SettingsView
     */
    addCategoriesPageEvents() {
        document.querySelector('.settings__buttons-skip').addEventListener('click', () => {
            router.navigate('/task-list');
        });
    }

    /**
     * @description add events listners for tabs block
     * @memberof SettingsView
     */
    activateSettingsTabs() {
        if (window.location.pathname === 'settings/pomodoros') {
            document.querySelector('.tab__btn-pomodoros').classList.add('tab__btn--active');
        }

        if (window.location.pathname === 'settings/categories') {
            document.querySelector('.tab__btn-categories').classList.add('tab__btn--active');
        }
    }

    /**
     * @description renders categories page
     * @memberof SettingsView
     */
    initializeCategoriesPage() {
        document.body.innerHTML = this.settingsCategories(this.model.settingsPageSettings);
    }

    /**
     * @description add events listners for settings page
     * @memberof SettingsView
     */
    addSettingsPageEvents() {
        document.querySelector('.tab__btn-pomodoros').addEventListener('click', () => {
            router.navigate('/settings/pomodoros');
        });

        document.querySelector('.tab__btn-categories').addEventListener('click', () => {
            router.navigate('/settings/categories');
        });
    }

    /**
     * @description renders settings page
     * @memberof SettingsView
     */
    initializeSettingPage() {
        document.body.innerHTML = this.template(this.model.settingsPageSettings);
        this.renderSettingsElement(this.model.allSettingsData());
        this.initButtons();
    }

    /**
     * @description sets events listeners for buttons settings page
     * @memberof SettingsView
     */
    initButtons() {
        this.initSettingsButtons();
        this.initSaveButtons();
    }

    /**
     * @description sets events listeners for buttons
     * @memberof SettingsView
     */
    initSaveButtons() {

        document.querySelector('.settings__buttons-save').addEventListener('click', () => {
            eventBus.post('saveData', 'settings');
        });

        document.querySelector('.settings__buttons-return').addEventListener('click', () => {
            eventBus.post('returnToHome');
        });
    }

    /**
     * @description sets events listeners for buttons on settings page
     * @memberof SettingsView
     */
    initSettingsButtons() {
        const buttons = [...document.querySelectorAll('.change-list__btn')];
        buttons.forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.parentElement.id;
                const currentValue = Number(
                    e.target.parentElement.querySelector('.change-list__input').innerHTML
                );
                if (e.target.classList.contains('change-list__plus')) {
                    eventBus.post('increaseValue', [id, currentValue]);

                } else {
                    eventBus.post('decreaseValue', [id, currentValue]);

                }
            });
        });
    }

    /**
     * @description write settings values in inputs
     * @memberof SettingsView
     */
    changeInputData() {
        const input = [...document.querySelectorAll('.change-list__input')];
        input.forEach(input => {
            const id = input.parentElement.id;
            input.innerHTML = this.model.buttonsValues[id].value;
        });
    }

    /**
     * @description render settings cycle
     * @param {object} data settings data
     * @memberof SettingsView
     */
    renderSettingsElement(data) {
        document.querySelector('.cycle__container').innerHTML = this.getCycleTemplate(data);
        this.changeInputData();
    }

    /**
     * @description returns cycle template 
     * @param {object} data settings data
     * @return {string} template for timeline
     * @memberof SettingsView
     */
    getCycleTemplate(data) {
        return this.cycleTemplate({ data, cycleLine: this.getScaleLinesTemplate(data), timeLine: this.createTimeLine(data) });
    }

    /**
     * @description creates scale line for shedule
     * @param {object} data settings data
     * @return {string} cycle template
     * @memberof SettingsView
     */
    getScaleLinesTemplate(data) {
        const firstCycleTemplate = this.createCycleTemplate(
            this.getScaleLine('work', data.buttonsValues.work.value),
            this.getScaleLine('short-break', data.buttonsValues.shortBreak.value),
            data.buttonsValues.iteration.value
        );
        const fullCycleTemplate = this.createCycleTemplate(
            firstCycleTemplate,
            this.getScaleLine('long-break', data.buttonsValues.longBreak.value),
            data.cycleCount
        );

        return fullCycleTemplate;
    }

    /**
     * @description returns scale line template
     * @param {string} name 
     * @param {number} value
     * @return {string} cycle line
     * @memberof SettingsView
     */
    getScaleLine(name, value) {
        return this.cycleLine({ name, value });
    }

    /**
     * @description returns full cicle template
     * @param {string} element 
     * @param {number} delimiter
     * @param {number} iteration
     * @return {string} cycle line template
     * @memberof SettingsView
     */
    createCycleTemplate(element, delimiter, iteration) {
        let template = '';
        template += element;
        for (let i = 0; i < iteration - 1; i++) {
            template += `${delimiter}${element}`;
        }

        return template;
    }

    /**
     * @description creates timeline template
     * @param {object} info settings ingo
     * @return {string} template for timeline
     * @memberof SettingsView
     */
    createTimeLine(info) {
        let template = '';
        const date = new Date();
        date.setHours(0);
        date.setMinutes(info.minutesInSchedule);
        for (let i = date.getMinutes(); i < info.fullCycleTime.full; i += info.minutesInSchedule) {
            const scheduleItem = this.createTimeLineBottomItem(date, info);
            template += scheduleItem;
            date.setMinutes(date.getMinutes() + info.minutesInSchedule);
        }

        if (info.timeScheduleDelimeter > 0) {
            template += `<span style="flex-grow: ${info.timeScheduleDelimeter};">`;
        } else {
            template += `<span style="flex-grow: ${info.minutesInSchedule};">`;
        }

        return template;
    }

    /**
     * @description creates item for timeline
     * @param {object} date timeline date
     * @param {object} info settings data
     * @return {string} item template
     * @memberof SettingsView
     */
    createTimeLineBottomItem(date, info) {

        let hiddenElement = date.getMinutes() > 0 ? 'cycle__caption-item--hidden' : '',
            elementGrowth = info.minutesInSchedule,
            value = `${date.getHours() > 0 ? date.getHours() + 'h ' : ''} ${date.getMinutes() > 0 ? date.getMinutes() + 'm' : ''}`;

        return this.cycleBottom({ hidden: hiddenElement, grow: elementGrowth, value });
    }
}