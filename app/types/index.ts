import { Conversation, Message, User } from "@prisma/client";

// Cầu hình type của các object con trong có quan hệ với model khác
export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
