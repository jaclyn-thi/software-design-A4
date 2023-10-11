import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";
//import { NotFoundError } from "./errors";

export interface TimedResourceDoc extends BaseDoc {
  resourceID: ObjectId;
  duration: number; // in minutes
  completedStatus: boolean;
}

export default class TimedResourceConcept {
  public readonly timers = new DocCollection<TimedResourceDoc>("timers");
  async create(resourceID: ObjectId, duration: number) {
    const _id = await this.timers.createOne({ resourceID: resourceID, duration: duration, completedStatus: false });
    return { msg: "Timer created!", timer: await this.timers.readOne({ user: _id }) };
  }

  async startTimer(_id: ObjectId) {
    const timer = await this.timers.readOne({ resourceID: _id });
    if (timer === null) {
      throw new NotFoundError("Timer not found!");
    } else if (timer.completedStatus !== false) {
      throw new NotAllowedError("Reset timer first!");
    } else {
      return timer.duration; // returns duration to pass to the front end to start decrementing
      // when counter on front end reaches zero front end will call another post request to update the completedStatus
    }
  }

  async getTimer(_id: ObjectId) {
    const timer = await this.timers.readOne({ resourceID: _id });
    if (timer === null) {
      throw new NotFoundError("Timer not found!");
    } else {
      return { msg: "Timer found!", timer: timer };
    }
  }

  async updateTimer(_id: ObjectId, update: Partial<TimedResourceDoc>) {
    const timer = await this.timers.readOne({ resourceID: _id });
    if (timer === null) {
      throw new NotFoundError("Timer not found!");
    } else {
      await this.timers.updateOne({ resourceID: _id }, update);
      return { msg: "Timer updated!", timer: await this.timers.readOne({ resourceID: _id }) };
    }
  }

  async resetTimer(_id: ObjectId) {
    const timer = await this.timers.readOne({ resourceID: _id });
    if (timer === null) {
      throw new NotFoundError("Timer not found!");
    } else if (timer.completedStatus !== true) {
      throw new NotAllowedError("Timer not finished!");
    } else {
      await this.timers.updateOne({ resourceID: _id }, { completedStatus: false });
      return { msg: "Timer reset!", timer: await this.timers.readOne({ resourceID: _id }) };
    }
  }
}
