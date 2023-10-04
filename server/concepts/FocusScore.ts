import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface FocusScoreDoc extends BaseDoc {
  score: number;
  user: ObjectId;
}

export default class FocusScoreConcept {
  public readonly FocusScores = new DocCollection<FocusScoreDoc>("FocusScores");

  async create(_id: ObjectId, score: number = 0) {
    if (this.FocusScores.readOne(_id) === null) {
      await this.FocusScores.createOne({ score, _id });
    }
  }

  async getFocusScore(_id: ObjectId) {
    if (this.FocusScores.readOne({ _id }) === null) {
      throw new NotFoundError("User not found!");
    } else {
      return await this.FocusScores.readOne({ _id });
    }
  }

  async updateScore(_id: ObjectId, update: Partial<FocusScoreDoc>) {
    if (this.FocusScores.readOne({ _id }) === null) {
      throw new NotFoundError("User not found!");
    } else {
      return await this.FocusScores.updateOne({ _id }, update);
    }
  }
}
