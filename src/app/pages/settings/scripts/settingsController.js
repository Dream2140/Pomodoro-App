import { eventBus } from '../../../helpers/eventBus';
import { router } from '../../../routes';

/**
 * @description controls setting's component
 * @exports SettingsController
 * @class SettingsController
 */
export class SettingsController {
    /**
     * @description Creates an instance of SettingsController
     * @param {object} view instance of SettingsView
     * @param {object} model instance of SettingsModel
     * @memberof SettingsController
     */
    constructor(view, model) {
        this.view = view;
        this.model = model;

        eventBus.subscribe('load-page', () => {
            this.initSettingsPage();
        });

        eventBus.subscribe('saveData', async key => {
            try {
                const userId = this.model.settingsData.getDataFromStorage('userId');
                await this.model.settingsData.sendData(
                    userId, 'settings',
                    this.model.settingsData.getDataFromStorage(key)
                );

                $(document).notification('clean');
                $(document).notification({
                    type: 'success',
                    text: 'Settings was successfully saved',
                    showTime: 3,
                });

                router.navigate('/task-list');
            } catch (error) {

                $(document).notification('clean');
                $(document).notification({
                    type: 'error',
                    text: 'Unable to save settings. Try again later: ' + error.message,
                    showTime: 3,
                });
            }
        });

        eventBus.subscribe('returnToHome', () => {
            router.navigate('/task-list');
        });
    }

    /**
     * @description init settings page
     * @memberof SettingsController
     */
    initSettingsPage() {
        const currentRoute = window.location.pathname;

        if (/settings\/pomodoros/.test(currentRoute)) {

            this.model.getAndSaveDataFromStorage();
            eventBus.post('renderSettingsPage');
            eventBus.subscribe('increaseValue', args => this.model.increaseValue(args));
            eventBus.subscribe('decreaseValue', args => this.model.decreaseValue(args));
            eventBus.post('pageLoaded');
        }
    }
}