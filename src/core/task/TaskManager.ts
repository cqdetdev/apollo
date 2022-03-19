import Base from "../structures/Base";
import Task from "./Task";

export default class TaskManager extends Base {
    public tasks: Task[] = [];

    public start() {
        for(let task of this.tasks) {
            task.execute();
        }
    }

    public scheduleTask(task: Task) {
        this.tasks.push(task);
    }
}