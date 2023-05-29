"use client";
import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOrtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  // Lấy id của ng còn lại
  // console.log("conversation", conversation);
  const otherUser = useOtherUser(conversation);
  const [drawOpen, setDrawOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawOpen}
        onClose={() => setDrawOpen(false)}
      />
      <div className="bg-white w-full flex border-b-[1px]  py-3  sm:px-4 lg:px:6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            className="lg:hidden block text-sky-600 transition cursor-pointer"
            href={"/conversations"}
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            // Conversation data có include users
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            {conversation.name ||
              otherUser.name?.replace(/^\w/, (c) => c.toUpperCase())}
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawOpen(true)}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </div>
    </>
  );
};

export default Header;
