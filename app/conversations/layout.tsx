import ConversationList from "./components/ConversationList";
import getConversations from "../actions/getConversation";
import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";

export default async function CocnversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversation = await getConversations();
  const users = await getUsers();

  return (
    // @ts-expect-error Server Component
    // Side bar chiếm w-20
    <Sidebar>
      <div className="h-full conversation-chat">
        {/* Conversation w-80 */}
        <ConversationList initalItems={conversation} users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
