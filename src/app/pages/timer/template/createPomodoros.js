export default function (amountOfPomodoros) {
    if (!amountOfPomodoros || !parseInt(amountOfPomodoros, 10)) {
 return ''; 
}
    let fragment = '';
  
    for (let i = 0; i < parseInt(amountOfPomodoros, 10); i++) {
      fragment += '<span class="estimation__item"></span>';
    }
  
    return fragment;
  }
  