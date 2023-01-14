export const chartOptions = {
    day: {
      plotOptions: {
        series: {
          pointWidth: 40
        }
      }
    },
    week: {
      plotOptions: {
        column: {
          stacking: 'normal',
          borderWidth: 0
        },
        series: {
          pointWidth: 26,
          pointPadding: 0.44,
          groupPadding: 0.1
        }
      },
      xAxis: {
        minPadding: 44
      }
    },
    month: {
      plotOptions: {
        column: {
          stacking: 'normal',
          borderWidth: 0
        },
        series: {
          pointWidth: 26,
          pointPadding: 0.44,
          groupPadding: 0.1
        }
      },
      xAxis: {
        maxPadding: 12,
        labels: {
          padding: 0
        }
      }
    }
  };
  