import { eventBus } from '../../../../helpers/eventBus';

/**
 * @description manages highcharts library
 * @exports HighchartController
 * @class HighchartController
 */
export class HighchartController {

  /**
   * @description Creates an instance of HighchartController.
   * @param {object} model instance of HighchartModel.
   * @param {object} view instance of HighchartView.
   * @memberof HighchartController
  */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    eventBus.subscribe('create-report', arg => this.model.createChart(arg));
  }
}