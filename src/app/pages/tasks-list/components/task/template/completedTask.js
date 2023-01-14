/**
 * @description returns css class to highlight completed task
 * @exports
 * @param {string} status current status of task
 * @return {string} css class
 */
export default function (status) {
    return status === 'COMPLETED' ? 'task--done' : '';
}