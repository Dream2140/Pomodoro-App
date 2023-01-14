export const chartThemes = {
    colors: ['#F75C4C', '#FFA841', '#FDDC43', '#1ABC9C', '#8DA5B8'],
    chart: {
      backgroundColor: '#2A3F50'
    },
    yAxis: {
      showEmpty: true,
      tickInterval: 2,
      title: {
        enabled: false,
        text: null
      },
      labels: {
        style: {
          color: '#FFF',
          font: 'regular 14px PT Sans, sans-serif',
          'text-transform': 'uppercase',
          'line-height': '16px'
        },
        step: 1
      },
      endOnTick: false,
      maxPadding: 0,
      lineColor: '#FFF',
      lineWidth: 1,
      gridLineColor: '#345168'
    },
    title: {
      enabled: false,
      text: null
    },
    legend: {
      itemStyle: {
        font: 'bold 11px Roboto, sans-serif',
        'text-transform': 'capitalize',
        color: '#8DA5B8'
      },
      symbolHeight: 8,
      symbolWidth: 8,
      symbolRadius: 0,
      itemHoverStyle: {
        color: '#8DA5B8'
      }
    },
    plotOptions: {
      series: {
        cursor: 'pointer',
        borderColor: '#2A3F50',
        centerInCategory: true,
        states: {
          hover: {
            enabled: false
          },
          inactive: {
            enabled: false
          }
        }
      },
      column: {
        shadow: false
      }
    },
    xAxis: {
      showEmpty: true,
      lineColor: '#FFF',
      lineWidth: 1,
      labels: {
        step: 1,
        style: {
          align: 'center',
          color: '#FFF',
          font: 'bold 11px PT Sans, sans-serif',
          'text-transform': 'uppercase',
          'line-height': '16px'
        }
      }
    },
    navigation: {
      buttonOptions: {
        enabled: false
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      color: '#3C5162',
      fontWeight: 'bold',
      cursor: 'pointer',
      'text-transform': 'uppercase',
      borderWidth: 0,
      shadow: false,
      useHTML: true,
      padding: 0,
      style: {
        padding: 0
      }
    }
  };
  