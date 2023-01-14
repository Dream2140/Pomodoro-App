import { eventBus } from '../../../helpers/eventBus';
import { router } from '../../../routes';

export class TimerController {

    constructor(view, model) {
        this.view = view;
        this.model = model;

        eventBus.subscribe('timer-loading', async () => {
            await this.model.initTimer();
            eventBus.post('pageLoaded');
        });

        eventBus.subscribe('return-to-task-list', () => {
            router.navigate('/task-list');
        });

        eventBus.subscribe('return-to-task-list', () => {
            const activeTask = this.model.activeTask;
            eventBus.post('end-task-working', activeTask);
        });

        eventBus.subscribe('finish-pomodoro', isSuccessfullyCompleted => {
            this.model.finishPomodoro(isSuccessfullyCompleted);

            if (this.model.isTaskCompleted()) {
                eventBus.post('finish-task');
            }
        });

        eventBus.subscribe('finish-task', () => {
            this.model.finishTask();
        });

        eventBus.subscribe('raise-estimate', () => {
            this.model.raiseEstimate();
          });
    }
}

