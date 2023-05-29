import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherClient, pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currenUser = await getCurrentUser();

    const { message, image, conversationId } = body;
    if (!currenUser?.id || !currenUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        sender: {
          connect: {
            id: currenUser?.id,
          },
        },
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        seen: {
          connect: {
            id: currenUser?.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    // console.log("pusherServer new message: ", newMessage);
    // console.log("updated conversation", updatedConversation);

    // trigger to sever tin nhắn mới
    // channel mà Pusher sử dụng để phân phối các sự kiện tới các client.
    await pusherServer.trigger(conversationId, "messages:new", newMessage);
    // khi một tin nhắn mới được gửi, server sẽ tạo ra một sự kiện có tên "messages:new" và phát sóng nó trên kênh tương ứng với ID cuộc trò chuyện (conversationId).

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    // trigger to sever tin nhắn mới
    // user.email channel mà Pusher sử dụng để phân phối các sự kiện tới các client

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error(error, "Error message");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
