"use client";
import clsx from "clsx";
import useConversation from "../hooks/useConversation";
import EmptyState from "../components/EmptyState";

const Home = () => {
  // Nếu có conversationID thì hiễn thị EmtyState
  const { isOpen } = useConversation();

  // console.log("isOpen HomePage", isOpen);

  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
