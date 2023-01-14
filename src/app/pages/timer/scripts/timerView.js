import * as timerTemplate from '../template/timer.hbs';
import * as startTaskBtn from '../template/startTaskBtn.hbs';
import { eventBus } from '../../../helpers/eventBus';


const MAX_AMOUNT_OF_POMODOROS = 10;
export class TimerView {

  constructor(model) {
    this.model = model;

    this.model.timerInitEvent.subscribe(this.initTimerPage.bind(this));
    this.model.initBreakEvent.subscribe(this.startBreakTimer.bind(this));
    this.model.fillPomodoroEvent.subscribe(
      this.renderCompletedPomodoro.bind(this)
    );
    this.model.estimationChangedEvent.subscribe(this.addPomodoro.bind(this));
    this.model.taskCompletedEvent.subscribe(
      this.renderCompletedScreen.bind(this)
    );
  }

  initTimerPage(arg) {
    const [task, settings] = arg;
    document.body.innerHTML = timerTemplate(task);
    this.addTimerEvents(settings);

    $('#timer').radialTimer({
      category: task.categoryId
    });
  }

  addTimerEvents(settings) {

    document.querySelector('.go-to-task-list').addEventListener('click', () => {
      eventBus.post('return-to-task-list');
    });

    document.querySelector('.service-btn__btn-start-task').addEventListener('click', () => {
      this.startTimer(settings);
    });

    document.querySelector('.estimation__btn').addEventListener('click', () => {
      eventBus.post('raise-estimate');
    });
  }

  startTimer(settings) {

    document.querySelector('.go-to-task-list').classList.add('d-none');
    document.querySelector('.header').classList.add('hidden');

    this.renderTimerControlsButtons();
    this.startPomodoro(settings.work.value);
  }

  renderTimerControlsButtons() {

    document.querySelector('.timer-section__btn').innerHTML = startTaskBtn({
      secondBtn: true,
      firstColor: 'red',
      firstServiceClass: 'fail-pomodora',
      firstData: 'Fail Pomodora',
      secondColor: 'green',
      secondServiceClass: 'finish-pomodora',
      secondData: 'Finish Pomodora'
    });

    document.querySelector('.fail-pomodora').addEventListener('click', () => {
      this.finishPomodoro(false);
    });
    document.querySelector('.finish-pomodora').addEventListener('click', () => {
      this.finishPomodoro(true);
    });

    document.querySelector('.estimation__btn').classList.add('d-none');
  }

  finishPomodoro(state) {
    eventBus.post('finish-pomodoro', state);
  }

  startPomodoro(value) {
    $('#timer').radialTimer({
      time: value,
      content: timeLeft => {
        const currentTime = timeLeft - 1;

        if (currentTime > 0) {
          return `<p class="timer__text-time">${currentTime}</p>
          <p class="timer__text-bottom">min</p>`;
        }
      },
      renderInterval: 1,
      onTimeout: this.finishPomodoro.bind(TimerView)
    });
  }

  startBreakTimer(arg) {
    const [isSuccessfullyCompleted, isLongBreak, settings] = arg;
    this.renderBreakControlsButtons(isSuccessfullyCompleted, settings);

    const options = {
      time: isLongBreak ? settings.longBreak.value : settings.shortBreak.value,
      content: timeLeft => {
        const currentTime = timeLeft - 1;

        if (currentTime > 0) {
          return `<p class="timer__text-top">break</p>
          <p class="timer__text-time" >${currentTime}</p>
          <p class="timer__text-bottom">min</p>`;
        } else {
          return '<span class="timer__text-time">Break is over</span>';
        }
      },
      renderInterval: 1,
      onTimeout: function () {
        this.content();
      }
    };

    $('#timer').radialTimer(options);
  }

  renderBreakControlsButtons(isSuccessfullyCompleted, settings) {

    const btnSettings = {
      firstColor: 'green',
      firstServiceClass: 'start-timer',
      firstData: 'Start Pomodora'
    };

    if (isSuccessfullyCompleted) {
      Object.assign(btnSettings, {
        secondBtn: true,
        secondColor: 'blue',
        secondServiceClass: 'finish-task',
        secondData: 'Finish Task'
      });

      document.querySelector('.timer-section__btn').innerHTML = startTaskBtn(btnSettings);

      document.querySelector('.finish-task').addEventListener('click', () => {
        eventBus.post('finish-task');
      });
    } else {
      document.querySelector('.timer-section__btn').innerHTML = startTaskBtn(btnSettings);
    }

    document.querySelector('.estimation__btn').classList.remove('d-none');

    document.querySelector('.start-timer').addEventListener('click', () => {
      this.startTimer(settings);
    });
  }

  renderCompletedScreen() {
    $('#timer').radialTimer({
      content: 'You Completed Task',
      showFull: true
    });

    document.querySelector('.go-to-task-list').classList.remove('d-none');
    document.querySelector('.header').classList.remove('hidden');
    document.querySelector('.go-to-reports-page').classList.remove('d-none');
    document.querySelector('.estimation__btn').classList.add('d-none');
    document.querySelector('.timer-section__btn').classList.add('hidden');
  }

  renderCompletedPomodoro(arg) {

    const [isSuccessfullyCompleted, index] = arg;
    const pomodorosBlock = document.querySelector('.estimation__container');
    const currentPomodoro = pomodorosBlock.children[index];

    if (isSuccessfullyCompleted) {
      currentPomodoro.classList.add('estimation__item--done');
    } else {
      currentPomodoro.classList.add('estimation__item--failed');
    }
  }

  addPomodoro() {

    const addPomodorosBtn = document.querySelector('.estimation__btn');
    const pomodorosBlock = document.querySelector('.estimation__container');
    const pomodoro = this.createEmptyPomodoro();

    pomodorosBlock.insertBefore(pomodoro, addPomodorosBtn);

    if (pomodorosBlock.children.length > MAX_AMOUNT_OF_POMODOROS) {
      addPomodorosBtn.classList.add('hidden');
    }
  }

  createEmptyPomodoro() {
    const pomodoro = document.createElement('span');
    pomodoro.classList.add('estimation__item');

    return pomodoro;
  }
} 