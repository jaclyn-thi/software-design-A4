import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface RoomDoc extends BaseDoc {
  host: ObjectId;
  occupants: ObjectId[];
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
      const existing = room.occupants.find((userId) => userId === user);
      if (existing !== undefined) {
        throw new NotAllowedError("User already in room!");
      }
      //   const occupantList = room.occupants;
      //   for (const elt of occupantList) {
      //     if (elt === user) {
      //       throw new NotAllowedError("User already in room!");
      //     }
      //   }
      room.occupants.push(user);
      return { msg: "User added!", room: room };
    }
  }

  async removeUser(user: ObjectId, host: ObjectId) {
    const room = await this.rooms.readOne({ host });
    if (room === null) {
      throw new NotFoundError("Room not found!");
    } else {
      const index = room.occupants.indexOf(user);
      if (index === -1) {
        throw new NotFoundError("Could not find user in room!");
      } else {
        room.occupants.splice(index, 1);
      }
      return { msg: "User removed!", room: room };
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
