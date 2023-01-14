export class TaskModel {
  constructor(options) {
    this.options = {
      title : options.title,
      description : options.description,
      failedPomodoros : options.failedPomodoros,
      completeDate : options.completeDate,
      completedCount : options.completedCount,
      priority : options.priority,
      categoryId : options.categoryId,
      status : options.status,
      estimation : options.estimation,
      deadline : options.deadline,
    }
  }
}