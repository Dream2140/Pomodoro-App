/**
 * @description set page title according to current route
 * @exports pageTitle
 * @return {string} name of page according to current route
 */
export default function () {
    const pageTitles = {
      default: 'Daily task list',
      'task-list': 'Daily task list',
      settings: 'Settings',
      reports: 'Report',
      timer: ' '
    };
    const pageHash = `${window.location.pathname}/`.match(/^\/(.*?)\//);
  
    if (pageHash) {
      const pageTitle = pageTitles[pageHash[1]];
      if (pageTitle) {
        return pageTitle;
      }
    }
  
    return pageTitles.default;
  }