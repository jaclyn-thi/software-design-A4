import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface RoomDoc extends BaseDoc {
  host: ObjectId;
}

export default class RoomConcept {
  public readonly rooms = new DocCollection<RoomDoc>("rooms");
  public readonly occupants = Set<ObjectId>; //correct?
}
