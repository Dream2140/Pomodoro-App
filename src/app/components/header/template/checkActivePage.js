/**
 * @description manages page hash and active css class according to it
 * @exports checkActivePage
 * @param {string} value contains the button value 
 * @return {string} css class of active nav button
 */
export default function (value) {
    const pageHash = `${window.location.pathname}/`.match(/^\/(.*?)\//);
  
    if (pageHash && pageHash[1] === value) {
      return 'navigation__btn--active';
    }
  }
  