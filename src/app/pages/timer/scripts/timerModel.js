import {
    eventBus
} from '../../../helpers/eventBus';
import {
    Helpers
} from '../../../helpers/helpers';
import {
    Observer
} from '../../../helpers/observer';
import {
    settingsData
} from '../../../helpers/settingsData';

export class TimerModel {

    constructor() {
        this.settingsData = settingsData;

        this.timerInitEvent = new Observer();
        this.initBreakEvent = new Observer();
        this.fillPomodoroEvent = new Observer();
        this.estimationChangedEvent = new Observer();
        this.taskCompletedEvent = new Observer();

        this.pomodoroSettings = null;
        this.activeTask = null;
        this.currentPomodoroIndex = 0;
        this.date = Helpers.getCurrentDate();
    }

    async initTimer() {
        try {
            this.currentPomodoroIndex = 0;
            this.activeTask = this.getDataFromStorage('active-task');

            if (!this.activeTask) {
                eventBus.post('return-to-task-list');
            }

            this.activeTask.failedPomodoros = [];
            this.activeTask.completedCount = [];

            const settings = await this.getAndSaveSettings();

            this.timerInitEvent.notify([this.activeTask, settings]);
        } catch (err) {
            console.error(err.message);
        }
    }

    async getAndSaveSettings() {
        try {
            await this.settingsData.receiveData('settings');
            this.pomodoroSettings = this.settingsData.getDataFromStorage('settings');

            return this.pomodoroSettings;
        } catch (err) {
            console.error(err.message);
        }
    }

    getDataFromStorage(key) {
        if (!key || typeof key !== 'string') return;
        const task = this.settingsData.getDataFromStorage(key);

        return task;
    }

    finishPomodoro(isSuccessfullyCompleted) {
        const isLongBreak = this.isLongBreak();

        if (isSuccessfullyCompleted) {

            this.setCompletedPomodoro();
        } else {

            this.setFailedPomodoro();
        }

        this.initBreakEvent.notify([
            isSuccessfullyCompleted,
            isLongBreak,
            this.pomodoroSettings
        ]);

        this.fillPomodoroEvent.notify([
            isSuccessfullyCompleted,
            this.currentPomodoroIndex
        ]);

        this.raiseIndex();
        this.showFinishPomodoroNotification(false);
    }

    isLongBreak() {
        return (
            (this.currentPomodoroIndex || 1) % this.pomodoroSettings.iteration.value === 0
        );
    }

    setCompletedPomodoro() {
        this.activeTask.completedCount.push(this.currentPomodoroIndex);
    }

    setFailedPomodoro() {
        this.activeTask.failedPomodoros.push(this.currentPomodoroIndex);
    }

    raiseIndex() {
        this.currentPomodoroIndex++;
    }

    isTaskCompleted() {
        return (
            this.currentPomodoroIndex === parseInt(this.activeTask.estimation, 10)
        );
    }

    finishTask() {
        this.activeTask.status = 'COMPLETED';
        console.log(Helpers.getCurrentDate());
        this.activeTask.completeDate = this.date;

        if (!this.isTaskCompleted()) {
            this.completeAllPomodoros();
        }

        this.taskCompletedEvent.notify();
        this.settingsData.sendData('tasks', this.activeTask, this.activeTask.id)
            .then(() => {
                this.showFinishPomodoroNotification(this.isLongBreak());
            })
            .catch(() => {
                this.showErrorNotification();
            });
    }

    completeAllPomodoros() {
        for (let i = this.currentPomodoroIndex; i < this.activeTask.estimation; i++) {

            this.setCompletedPomodoro();
            this.fillPomodoroEvent.notify([true, i]);
            this.raiseIndex();
        }
    }

    showFinishPomodoroNotification(isLongBreak) {
        if (isLongBreak) {
            $(document).notification({
                type: 'warning',
                text: 'Long break started, please have a rest!',
                showTime: 3,
            });
        } else {
            $(document).notification({
                type: 'success',
                text: 'You finished pomodoro!',
                showTime: 3,
            });
        }
    }

    showErrorNotification() {
        $(document).notification('clean');
        $(document).notification({
            type: 'error',
            text: 'Unable to mark pomodoro/task as completed. Try again later',
            showTime: 3,
        });
    }

    raiseEstimate() {
        this.activeTask.estimation++;

        this.estimationChangedEvent.notify();
    }
}