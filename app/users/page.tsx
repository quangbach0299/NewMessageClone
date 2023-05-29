"use client";
import { signOut } from "next-auth/react";
import EmptyState from "../components/EmptyState";
import { useParams } from "next/navigation";

const Users = () => {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
};

export default Users;
