/**
 * @description check active tabs on report page
 * @exports checkActiveState
 * @param {boolean} period check if reports by time should be shown
 * @param {string} value current tab value
 * @return {string} active css class
 */
export default function (period, value) {
    if (period) {
      const regex = /(^\/reports\/)(.*)\//gm;
      const match = regex.exec(`${window.location.pathname}`);
      let time;
  
      if (match) {
        time = match[2];
      }
  
      if (time === value) {
        return 'tab__btn--active';
      }
    } else {
      const regex = /(^\/reports\/)(.*)\/(.*)$/gm;
      const match = regex.exec(`${window.location.pathname}`);
      let category;
  
      if (match) {
        category = match[3];
      }
  
      if (category === value) {
        return 'tab__btn--active';
      }
    }
  }