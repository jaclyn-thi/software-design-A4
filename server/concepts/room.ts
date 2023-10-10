import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface RoomDoc extends BaseDoc {
  host: ObjectId;
  occupants: Array<ObjectId>;
}

export default class RoomConcept {
  public readonly rooms = new DocCollection<RoomDoc>("rooms");

  async create(user: ObjectId) {
    const _id = await this.rooms.createOne({ host: user, occupants: new Array<ObjectId>() });
    return { msg: "Room created!!", room: await this.rooms.readOne({ _id }) };
  }

  async getRoom(host: ObjectId) {
    const room = await this.rooms.readOne({ host });
    if (room === null) {
      throw new NotFoundError("Room not found!");
    } else {
      return room;
    }
  }

  async addUser(user: ObjectId, host: ObjectId) {
    const room = await this.rooms.readOne({ host });
    if (room === null) {
      throw new NotFoundError("Room not found!");
    } else {
      console.log(room.occupants);
      const occupantList = room.occupants;
      for (const elt of occupantList) {
        if (String(elt) === String(user)) {
          throw new NotAllowedError("User already in room!");
        }
      }
      room.occupants.push(user);
      await this.rooms.updateOne({ host }, room);
      return { msg: "User added!", room: room };
    }
  }

  async removeUser(user: ObjectId, host: ObjectId) {
    const room = await this.rooms.readOne({ host });
    if (room === null) {
      throw new NotFoundError("Room not found!");
    } else {
      console.log("user:", user);
      const occupantList = room.occupants;

      let count = 0;
      for (const elt of occupantList) {
        if (String(elt) === String(user)) {
          room.occupants.splice(count, 1);
          await this.rooms.updateOne({ host }, room);
          return { msg: "User removed!", room: room };
        } else {
          count += 1;
        }
      }
      throw new NotFoundError("User not found!");
    }
  }

  async getOccupants(host: ObjectId) {
    const room = await this.rooms.readOne({ host });
    if (room === null) {
      throw new NotFoundError("Room not found!");
    } else {
      return { msg: "Occupants found!", occupants: room.occupants };
    }
  }
}
