import { Helpers } from '../../../helpers/helpers';
import { Observer } from '../../../helpers/observer';
import { settingsData } from '../../../helpers/settingsData';

const HALF_HOUR_IN_MINUTES = 30;
const COUNT_OF_CYCLES = 2;

/**
 * @description manages settings' data
 * @exports SettingsModel
 * @class SettingsModel
 */
export class SettingsModel {

    /**
     * @description Creates an instance of SettingsModel
     * @memberof SettingsModel
     */
    constructor() {
        this.settingsData = settingsData;
        this.changeButtonsEvent = new Observer();
        this.buttonsValues = null;
        this.allSettingsData = () => this.getAllSettingsData();
        this.settingsPageSettings = {
            leftTabs: false,
            typeTabs: 'settings__tabs',
            tabPosition: 'tab__item--right',
            tabData: [
                {
                    serviceClass: 'tab__btn-pomodoros',
                    data: 'Pomodoros'
                },
                {
                    serviceClass: 'tab__btn-categories',
                    data: 'Categories'
                }
            ]
        };
    }

    /**
     * @description gets and saves settings data from locale storage
     * @memberof SettingsModel
     */
    getAndSaveDataFromStorage() {
        const dataFromStorage = JSON.parse(sessionStorage.getItem('settings'));
        this.buttonsValues = Helpers.sortObjectByKeys(dataFromStorage);
    }

    /**
     * @description sets default values for buttons
     * @memberof SettingsModel
     */
    setDefaultValue() {
        for (const [key] of Object.entries(this.buttonsValues)) {
            this.setValue(key, this.buttonsValues[key].default);
        }
    }

    /**
     * @description gets data for current settings shedule state
     * @return {object} data for rendering schedule
     * @memberof SettingsModel
     */
    getAllSettingsData() {
        return {
            buttonsValues: this.buttonsValues,
            cycleCount: COUNT_OF_CYCLES,
            minutesInSchedule: HALF_HOUR_IN_MINUTES,
            fullCycleTime: this.getFullCycleTime(),
            firstCycleTime: this.getFirstCycleTime(),
            secondCycleTime: this.getFullCycleTime().full - this.getFirstCycleTime().full,
            timeScheduleDelimeter: this.getFullCycleTime().full % HALF_HOUR_IN_MINUTES
        };
    }

    /**
     * @description calculates time for settings first cycle shedule
     * @return {object} first Cycle Time for shedule
     * @memberof SettingsModel
     */
    getFirstCycleTime() {
        const data = this.buttonsValues;
        const firstCycleTime =
            data.work.value * data.iteration.value +
            data.shortBreak.value * (data.iteration.value - 1) +
            data.longBreak.value;
        const firstCycleTimeHours = Math.floor(firstCycleTime / 60);
        const firstCycleTimeMinutes = Math.floor(firstCycleTime % 60);

        return {
            full: firstCycleTime,
            hours: firstCycleTimeHours,
            minutes: firstCycleTimeMinutes
        };
    }

    /**
     * @description calculates time for settings shedule
     * @return {object} full time for shedule
     * @memberof SettingsModel
     */
    getFullCycleTime() {
        const data = this.buttonsValues;
        const fullTime = (data.work.value * data.iteration.value + data.shortBreak.value * (data.iteration.value - 1)) *
            COUNT_OF_CYCLES +
            data.longBreak.value * (COUNT_OF_CYCLES - 1);

        const fullTimeHours = Math.floor(fullTime / 60);
        const fullTimeMinutes = Math.floor(fullTime % 60);

        return {
            full: fullTime,
            hours: fullTimeHours,
            minutes: fullTimeMinutes
        };
    }

    /**
     * @description increases buttons value
     * @param {object} args id of button and current buttons value
     * @memberof SettingsModel
     */
    increaseValue(args) {
        if (!Array.isArray(args)) return;
        const [id, currentValue] = args;
        if (
            !id ||
            typeof id !== 'string' ||
            !currentValue ||
            typeof currentValue !== 'number'
          ) {
            return;
          }
        const newValue = currentValue + this.buttonsValues[id].step;
        this.setValue(id, newValue);
    }

    /**
     * @description decreases buttons value
     * @param {object} args id of button and current buttons value
     * @memberof SettingsModel
     */
    decreaseValue(args) {
        if (!Array.isArray(args)) return;
        const [id, currentValue] = args;
        if (
            !id ||
            typeof id !== 'string' ||
            !currentValue ||
            typeof currentValue !== 'number'
          ) {
            return;
          }
        const newValue = currentValue - this.buttonsValues[id].step;
        this.setValue(id, newValue);
    }

    /**
     * @description sets buttons value
     * @param {number} id buttons id
     * @param {number} newValue new buttons value
     * @memberof SettingsModel
     */
    setValue(id, newValue) {
        if (newValue >= this.buttonsValues[id]?.min && newValue <= this.buttonsValues[id]?.max) {
            this.buttonsValues[id].value = newValue;
            this.saveSettingsData(this.buttonsValues);
        }
    }

    /**
     * @description save settings daya
     * @param {object} data settings data
     * @memberof SettingsModel
     */
    saveSettingsData(data) {
        const userId= settingsData.getDataFromStorage('userId');
        sessionStorage.setItem('settings', JSON.stringify(data));
        settingsData.sendData(userId,'settings',data);
        this.changeButtonsEvent.notify(this.allSettingsData());
    }
}
