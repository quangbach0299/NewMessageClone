import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, image } = await req.json();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateImage = await prisma.user.update({
      where: { id: currentUser?.id },
      data: { name, image },
    });

    return NextResponse.json(updateImage);
  } catch (error: any) {
    console.log(error, "ERROR_SETTINGS");
    return new NextResponse("ERROR_SETTINGS", { status: 500 });
  }
}
