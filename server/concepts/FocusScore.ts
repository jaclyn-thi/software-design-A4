import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface FocusScoreDoc extends BaseDoc {
  score: number;
  user: ObjectId;
}

export default class FocusScoreConcept {
  public readonly FocusScores = new DocCollection<FocusScoreDoc>("FocusScores");

  async create(user: ObjectId) {
    const _id = await this.FocusScores.createOne({ score: 0, user: user });
    return { msg: "FocusScore created!!", score: await this.FocusScores.readOne({ _id }) };
  }

  async getFocusScore(user: ObjectId) {
    const score = await this.FocusScores.readOne({ user });
    if (score === null) {
      console.log("problem user:", user);
      throw new NotFoundError("User not found!!!!");
    } else {
      return { msg: "Score:", score: score.score };
    }
  }

  async updateScore(user: ObjectId, update: Partial<FocusScoreDoc>) {
    if ((await this.FocusScores.readOne({ user })) === null) {
      throw new NotFoundError("User not found!!!");
    } else {
      await this.FocusScores.updateOne({ user }, update);
      return { msg: "Score updated!", score: await this.FocusScores.readOne({ user }) };
    }
  }
}
