import FocusScoreConcept from "./concepts/FocusScore";
import FriendConcept from "./concepts/friend";
import PostConcept from "./concepts/post";
import RoomConcept from "./concepts/room";
import StatusConcept from "./concepts/status";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Room = new RoomConcept();
export const FocusScore = new FocusScoreConcept();
export const Status = new StatusConcept();
