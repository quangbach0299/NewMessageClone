import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Finding the existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          include: { seen: true },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // Tìm last message

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update last seen of message
    const updatedMessage = await prisma.message.update({
      where: { id: lastMessage.id },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // update tin nhắn cuối cùng trong conversation include last seen of message
    await pusherServer.trigger(currentUser?.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });

    // Nếu currentUser.id đã tồn tại trong mảng seenIds (nghĩa là người dùng đã xem tin nhắn), điều kiện sau !== -1 sẽ đúng và hàm sẽ trả về thông tin về cuộc trò chuyện (chứ không cập nhật hay thông báo tin nhắn đã được cập nhật nữa).
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // update tin nhắn trong đó last seen of message
    await pusherServer.trigger(
      conversationId,
      "message:update",
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.log(error, "Error Message Seen");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
