import { ReportsController } from './scripts/reportsController';
import { ReportsModel } from './scripts/reportsModel';
import { ReportsView } from './scripts/reportsView';

import './styles/reports.less';

const reportsModel = new ReportsModel();
const reportsView = new ReportsView(reportsModel);

/* eslint-disable no-unused-vars */
const reportsController = new ReportsController(reportsView, reportsModel);
/* eslint-disable no-unused-vars */