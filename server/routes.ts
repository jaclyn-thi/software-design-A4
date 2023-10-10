import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { FocusScore, Friend, Post, Room, Status, User, WebSession } from "./app";
import { NotAllowedError } from "./concepts/errors";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  //Room routes
  @Router.post("/rooms/:user")
  async createRoom(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Room.create(user);
  }

  @Router.get("/rooms")
  async getRoom(hostName: string) {
    const host = await User.getUserByUsername(hostName);
    return await Room.getRoom(host._id);
  }

  @Router.get("/room/occupants")
  async getOccupants(hostName: string) {
    //get occupants for the room with host name host
    const host = await User.getUserByUsername(hostName);
    return await Room.getOccupants(host._id);
  }

  @Router.put("/room/occupants/:username")
  //add user to current session user's room
  async addUser(username: string, session: WebSessionDoc) {
    const user = await User.getUserByUsername(username);
    const host = WebSession.getUser(session);
    return await Room.addUser(user._id, host);
  }

  @Router.put("/room/occupants/remove/:username")
  async removeUser(username: string, session: WebSessionDoc) {
    // remove user from room.occupants
    const user = await User.getUserByUsername(username);
    const host = WebSession.getUser(session);
    return await Room.removeUser(user._id, host);
  }

  //FocusScore routes
  @Router.post("/FocusScores/:user")
  async createFocusScore(session: WebSessionDoc) {
    // for a user in current session without a score, instantiate FocusScore associated with user to 0
    const user = WebSession.getUser(session);
    return await FocusScore.create(user);
  }

  @Router.get("/FocusScore")
  async getFocusScore(username: string) {
    const user = await User.getUserByUsername(username);
    return await FocusScore.getFocusScore(user._id);
    // increase the FocusScore associated with User by the specified amount of points
  }

  @Router.put("/FocusScore/set/:user")
  async setScore(session: WebSessionDoc, points: number) {
    if (points == null) {
      throw new NotAllowedError("Invalid score!");
    }
    const user = WebSession.getUser(session);
    //const currentPoints = await FocusScore.getFocusScore(user);
    return await FocusScore.updateScore(user, { score: Number(points) });
    // increase the FocusScore associated with User by the specified amount of points
  }

  @Router.put("/FocusScore/update/:user")
  async updateScore(session: WebSessionDoc, points: number) {
    if (points == null) {
      throw new NotAllowedError("Invalid score!");
    }
    const user = WebSession.getUser(session);
    const currentPoints = await FocusScore.getFocusScore(user);
    return await FocusScore.updateScore(user, { score: Number(currentPoints.score) + Number(points) });
    // increase the FocusScore associated with User by the specified amount of points
  }

  // //routes for everything else lol
  // @Router.post("/Timers/:resource")
  // async createTimedResource(resource: ObjectId, duration: number) {
  //   // create a TimedResource from the resource object
  // }

  // @Router.put("Timers/:resource")
  // async updateDuration(timer: ObjectId, duration: number) {
  //   // change the duration of the given timed resource to duration
  // }

  // @Router.put("Timers/:resource")
  // async complete(timer: ObjectId) {
  //   // move the timer to the set of completed timers
  // }

  // @Router.put("Timers/:resource")
  // async resetTimer(timer: ObjectId) {
  //   // remove the timer from the set of completed timers
  // }

  // @Router.get("/tasks/:user")
  // async getTasks(session: WebSessionDoc) {
  //   // get tasks authored by the current user in session
  // }

  // @Router.post("/tasks/:user")
  // async createTask(session: WebSessionDoc, title: string, due: Date) {
  //   // create a task authored by the current user in session with the given date and due date
  // }

  // @Router.put("/task/:user/:_id")
  // async updateTask(task: ObjectId, update: Partial<UserDoc>) {
  //   // edit the task object
  // }

  @Router.post("/status/:user")
  async createStatus(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const ret = await Status.create(user);
    return ret;
  }

  @Router.get("/status")
  async getStatus(username: string) {
    const user = await User.getUserByUsername(username);
    const stat = await Status.getStatus(user._id);
    return { msg: "Status found!", status: stat };
  }

  @Router.put("/status/:user")
  async updateStatus(session: WebSessionDoc, newStatus: string) {
    const user = WebSession.getUser(session);
    if (newStatus !== "Online" && newStatus !== "Offline" && newStatus !== "Away" && newStatus !== "Focus") {
      throw new NotAllowedError("Invalid status type!");
    } else {
      await Status.updateStatus(user, { statusType: newStatus });
    }
    return { msg: "Status updated!", status: await Status.getStatus(user) };
  }

  // // !!!!!!!!synchronizations!!!!!!!
  // @Router.post("/focusrooms/")
  // async createFocusRoom(session: WebSessionDoc, duration: number) {
  //   // for a user in current session without a FocusRoom, create a FocusRoom where the host is user and focus duration is duration
  // }

  // @Router.put("/focusroom/:_id")
  // async addToFocusRoom(user: ObjectId) {
  //   // for a user with given Id, add user to FocusRoom if they are friends with the host of the focusroom
  // }

  // @Router.put("/focusroom/:_id")
  // async removeFromFocusRoom(user: ObjectId) {
  //   // for a user with given Id, remove user from FocusRoom if they are an occupant of that room
  // }

  // @Router.put("/focusroom/:_id")
  // async rewardFocusRoom(_id: ObjectId) {
  //   // when focus timer in focus room is moved to completed timers, add points to the FocusScores of all occupants based on the duration of the
  //   // focus timer
  // }

  // @Router.get("/leaderboard")
  // async getLeaderboard(session: WebSessionDoc, _id) {
  //   // returns an array containing the session user and all their friends, ordered by descending FocusScore
  // }
}

export default getExpressRouter(new Routes());
