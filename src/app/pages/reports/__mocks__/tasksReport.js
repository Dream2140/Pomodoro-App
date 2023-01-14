import { Helpers } from '../../../helpers/helpers';

export const tasks = [
  {
    categoryId: 'hobby',
    completeDate: Helpers.getCurrentDate(),
    completedCount: [0],
    createDate: { day: 17, fullDeadline: 1615978347385, month: 'March' },
    deadline: 'April 10, 2021',
    deadlineDate: { day: '', fullDeadline: 1616716800000, month: 'today' },
    description: 'Wow',
    estimation: '5',
    failedPomodoros: [0, 1, 2, 3, 4],
    id: '00807824925639886039',
    priority: 'high',
    status: 'COMPLETED',
    title: 'Wow',
  },
  {
    categoryId: 'hobby',
    completeDate: Helpers.getCurrentDate(),
    completedCount: [2, 3, 4],
    createDate: { day: 2, fullDeadline: 1617314051232, month: 'April' },
    deadline: 'April 15, 2021',
    deadlineDate: { day: 15, fullDeadline: 1618434000000, month: 'today' },
    description: 'Cool',
    estimation: '3',
    failedPomodoros: [0, 1],
    id: '08835933769418409683',
    priority: 'urgent',
    status: 'COMPLETED',
    title: 'Cool',
  },
];