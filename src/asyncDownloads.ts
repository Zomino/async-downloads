import { v4 } from 'uuid';

interface TaskMapValue {
    done: boolean;
    result?: unknown;
}

class TaskNotFound extends Error {
    constructor(message?: string) {
        super(message);
    }
};

const taskMap = new Map<string, TaskMapValue>();

function startTask(task: () => unknown) {
    const taskId = v4();

    taskMap.set(taskId, { done: false });

    const asyncTask = new Promise((resolve) => {
        const result = task();

        resolve(result);
    });

    console.log('Calling task');

    asyncTask.then((result) => {
        taskMap.set(taskId, { done: true, result });

        console.log('Task done');
    });

    console.log('Task called');

    return taskId;
}

function getTaskResult(taskId: string) {
    const task = taskMap.get(taskId);

    if (!task || !task.done) {
        throw new TaskNotFound();
    }

    taskMap.delete(taskId);

    return task.result;
}

export default {
    startTask,
    getTaskResult,
    TaskNotFound,
};