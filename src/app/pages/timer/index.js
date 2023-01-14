import { TimerController } from './scripts/timerController';
import { TimerModel } from './scripts/timerModel';
import { TimerView } from './scripts/timerView';

import './styles/timer.less';

const timerModel = new TimerModel();
const timerView = new TimerView(timerModel);

/* eslint-disable no-unused-vars */
const timerController = new TimerController(timerView, timerModel);
/* eslint-disable no-unused-vars */