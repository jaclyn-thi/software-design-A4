import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface TaskDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  due: Date;
  completionStatus: boolean;
}

export default class TaskConcept {
  public readonly tasks = new DocCollection<TaskDoc>("tasks");

  async create(user: ObjectId, title: string, due: Date) {
    const _id = await this.tasks.createOne({ author: user, title: title, due: due, completionStatus: false });
    return { msg: "Task created!", task: await this.tasks.readOne({ user: _id }) };
  }

  async getTasks(query: Filter<TaskDoc>) {
    const tasks = await this.tasks.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return { msg: "Tasks found!", tasks };
  }

  async updateTask(_id: ObjectId, update: Partial<TaskDoc>) {
    const task = this.tasks.readOne({ user: _id });
    if (task === null) {
      throw new NotFoundError("Task not found!");
    }
    await this.tasks.updateOne({ user: _id }, update);
    return { msg: "Task updated!", task: await this.tasks.readOne({ user: _id }) };
  }
}
