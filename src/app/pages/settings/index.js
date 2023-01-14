import { SettingsController } from './scripts/settingsController';
import { SettingsModel } from './scripts/settingsModel';
import { SettingsView } from './scripts/settingsView';

import './styles/settings.less';

const settingsModel = new SettingsModel();
const settingsView = new SettingsView(settingsModel);

/* eslint-disable no-unused-vars */
const settingsController = new SettingsController(settingsView, settingsModel);
/* eslint-disable no-unused-vars */
