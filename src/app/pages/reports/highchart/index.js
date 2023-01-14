import './highchart.less';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { chartOptions } from './chartOptions';
import { chartThemes } from './chartThemes';
import { HighchartController } from './scripts/highchartController';
import { HighchartModel } from './scripts/highchartModel';
import { Observer } from '../../../helpers/observer';
import { HighchartView } from './scripts/highchartView';
Exporting(Highcharts);

const highchartModel = new HighchartModel(
  chartThemes,
  chartOptions,
  Observer,
  Highcharts
);
const highchartView = new HighchartView(highchartModel, Highcharts);

/* eslint-disable no-unused-vars */
const highchartController = new HighchartController(
  highchartModel,
  highchartView
);
/* eslint-disable no-unused-vars */
