import {
  eventBus
} from './helpers/eventBus';
import {
  Helpers
} from './helpers/helpers';
import {
  Router
} from './router';

export const router = new Router({
  mode: 'history',
  root: '/',
});

router
  .add(/task-list/, () => {
    Helpers.firstSession();
    eventBus.post('task-list-loading');
  })
  .add(/settings\/pomodoros/, () => {
    Helpers.firstSession();
    eventBus.post('settings-page-loading');
  })
  .add(/settings\/categories/, () => {
    Helpers.firstSession();
    eventBus.post('settings-category-page-loading');
  })
  .add(/timer/, () => {
    Helpers.firstSession();
    eventBus.post('timer-loading');
  })
  .add(/reports\/day\/pomodoros/, () => {
    Helpers.firstSession();
    eventBus.post('reports-day-pomodoros-loading');
  })
  .add(/reports\/day\/tasks/, () => {
    Helpers.firstSession();
    eventBus.post('reports-day-tasks-loading');
  })
  .add(/reports\/week\/tasks/, () => {
    Helpers.firstSession();
    eventBus.post('reports-week-tasks-loading');
  })
  .add(/reports\/week\/pomodoros/, () => {
    Helpers.firstSession();
    eventBus.post('reports-week-pomodoros-lodaing');
  })
  .add(/reports\/month\/tasks/, () => {
    Helpers.firstSession();
    eventBus.post('reports-month-tasks-loading');
  })
  .add(/reports\/month\/pomodoros/, () => {
    Helpers.firstSession();
    eventBus.post('reports-month-pomodoros-loading');
  })
  .add('', () => {
    router.navigate(/task-list/);
  });