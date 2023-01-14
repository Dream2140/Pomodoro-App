/**
 * @description returns css class to hide button based on task status
 * @exports
 * @param {string} status current status of task
 * @return {string} css class
 */
export default function (status) {
    return status === 'DAILY_LIST' ? 'task__btn--hidden' : '';
}
