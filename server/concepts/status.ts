import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface StatusDoc extends BaseDoc {
  statusType: string;
  user: ObjectId;
}

export default class StatusConcept {
  public readonly statuses = new DocCollection<StatusDoc>("statuses");
  async create(_id: ObjectId, statusType: string) {
    if (this.statuses.readOne(_id) === null) {
      await this.statuses.createOne({ statusType, _id });
    }
    return { msg: "Status created!", statusType: await this.statuses.readOne({ _id }) };
  }

  async getStatus(_id: ObjectId) {
    const stat = await this.statuses.readOne({ _id });
    if (stat === null) {
      throw new NotFoundError("User not found!!");
    } else {
      return stat.statusType;
    }
  }

  async updateStatus(_id: ObjectId, update: Partial<StatusDoc>) {
    if (this.statuses.readOne({ _id }) === null) {
      throw new NotFoundError("User not found!");
    } else {
      return await this.statuses.updateOne({ _id }, update);
    }
  }
}
