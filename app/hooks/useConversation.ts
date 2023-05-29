import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const { conversationId } = useParams();

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      isOpen,
      conversationId: conversationId || "",
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
