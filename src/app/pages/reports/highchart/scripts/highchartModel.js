import {
  Helpers
} from '../../../../helpers/helpers';

/**
 * @description manages highcharts data
 * @exports HighchartModel
 * @class HighchartModel
 */
export class HighchartModel {

  /**
   * @description Creates an instance of HighchartModel
   * @param {object} themes highchart styles
   * @param {object} options highchart view options
   * @param {object} Observer instance of HighchartObserver
   * @param {object} Highcharts instance of Highchart
   * @memberof HighchartModel
   */
  constructor(themes, options, Observer, Highcharts) {
    this.options = options;
    this.highcharts = Highcharts;
    this.highcharts.theme = themes;
    this.categories = {
      day: ['urgent', 'high', 'middle', 'low', 'failed'],
      week: Helpers.getWeekDays(),
      month: Helpers.getMonthDays()
    };

    this.dataByPeriods = {
      day: this.createDayChartData.bind(this),
      week: this.createWeekChartData.bind(this),
      month: this.createMonthChartData.bind(this)
    };

    this.reportDataChangedEvent = new Observer();
  }

  /**
   * @description applies highcharts options and emits
   * observer event to render chart
   * @param {object} arg data and period for reports
   * @memberof HighchartModel
   */
  createChart(arg) {
    
    const [data, period] = arg;
    const options = this.options[period];
   
    this.highcharts.setOptions(this.highcharts.theme);

    const categories = this.categories[period];
    this.reportDataChangedEvent.notify([
      this.dataByPeriods[period]([data, categories]),
      categories,
      options
    ]);
  }

  /**
   * @description creates object with data for chart
   * @param {object} arg data and period for reports
   * @return {object} data for creating a chart for 1 day
   * @memberof HighchartModel
   */
  createDayChartData(arg) {
    if (!arg) return;

    const [data, categories] = arg;

    if (!data || typeof data !== 'object' || !data.length) {
      return this.createEmptyChart(categories);
    }

    const chartData = [];
    let i = 0;

    for (const [key, value] of Object.entries(data[0])) {

      if (key === 'date') continue;

      const obj = {
        name: key,
        data: [
          [i, value]
        ]
      };

      chartData.push(obj);
      i++;
    }

    return chartData;
  }

  /**
   * @description creates object with data for chart
   * @param {object} arg data and period for reports
   * @return {object} data for creating a chart for the last 7 days
   * @memberof HighchartModel
   */
  createWeekChartData(arg) {

    if (!arg) return;

    const [data, categories] = arg;

    if (
      !Array.isArray(data) ||
      typeof data !== 'object' ||
      !data.length ||
      !Array.isArray(categories) ||
      !categories.length
    ) {

      return this.createEmptyChart(categories);
    }

    const chartData = [];

    data.forEach(item => {
      const weekDayCurrent = Helpers.getCurrentWeekDayByDate(item.date);
      const xAxisIndex = categories.indexOf(weekDayCurrent);

      for (const [key, value] of Object.entries(item)) {
        if (key === 'date') {
          continue;
        }
        let obj = {};
        const category = chartData.find(elem => elem.name === key);
        if (category) {
          category.data.push([xAxisIndex, value]);
        } else {
          if (key === 'failed') {
            obj = {
              name: key,
              data: [
                [xAxisIndex, value]
              ]
            };
          } else {
            obj = {
              name: key,
              data: [
                [xAxisIndex, value]
              ],
              stack: 'success'
            };
          }

          chartData.push(obj);
        }
      }
    });

    return chartData;
  }

  /**
   * @description creates object with data for chart
   * @param {object} arg data and period for reports
   * @return {object} data for creating a chart for the last 30 days
   * @memberof HighchartModel
   */
  createMonthChartData(arg) {
    if (!arg) return;

    const [data, categories] = arg;

    if (
      !Array.isArray(data) ||
      typeof data !== 'object' ||
      !data.length ||
      !Array.isArray(categories) ||
      !categories.length
    ) {

      return this.createEmptyChart(categories);
    }
    const chartData = [];

    data.forEach(item => {
      const monthDayCurrent = Helpers.getCurrentMonthDayByDate(item.date);
      const xAxisIndex = categories.indexOf(monthDayCurrent);

      for (const [key, value] of Object.entries(item)) {
        if (key === 'date') {
          continue;
        }
        let obj = {};
        const category = chartData.find(elem => elem.name === key);
        if (category) {
          category.data.push([xAxisIndex, value]);
        } else {
          obj = {
            name: key,
            data: [
              [xAxisIndex, value]
            ]
          };
          chartData.push(obj);
        }
      }
    });

    return chartData;
  }

  /**
   * @description creates object with data for empty chart
   * @param {object} categories categories of the report
   * @return {object} data for creating an empty chart
   * @memberof HighchartModel
   */
  createEmptyChart(categories) {

    if (!Array.isArray(categories) || !categories.length) return;

    const chartData = [];
    let i = 0;

    categories.forEach(item => {
      const obj = {
        name: item,
        data: [
          [i, 0]
        ]
      };

      chartData.push(obj);
      i++;
    });

    return chartData;
  }
}