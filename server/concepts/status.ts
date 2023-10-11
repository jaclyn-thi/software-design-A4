import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface StatusDoc extends BaseDoc {
  statusType: "Online" | "Offline" | "Away" | "Focus";
  user: ObjectId;
}

export default class StatusConcept {
  public readonly statuses = new DocCollection<StatusDoc>("statuses");
  async create(user: ObjectId) {
    const _id = await this.statuses.createOne({ statusType: "Online", user: user });
    return { msg: "Status created!!", statusType: await this.statuses.readOne({ user: _id }) };
  }

  async getStatus(user: ObjectId) {
    const stat = await this.statuses.readOne({ user });
    if (stat === null) {
      throw new NotFoundError("User not found!!");
    } else {
      return stat; //return id of status item
    }
  }

  async updateStatus(user: ObjectId, update: Partial<StatusDoc>) {
    if (this.statuses.readOne({ user }) === null) {
      throw new NotFoundError("User not found!");
    } else {
      return await this.statuses.updateOne({ user }, update);
    }
  }
}
