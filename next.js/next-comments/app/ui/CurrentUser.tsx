import Image from "next/image";

import githubIcon from "@/app/../public/github-mark.svg";
import { useSession, signIn, signOut } from "next-auth/react";

export default function CurrentUser() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()}>
        <img
          className="avatar"
          src={session?.user?.image || ""}
          alt="Author Avatar"
        />
        {session?.user?.name}
      </button>
    );
  }
  return (
    <button onClick={() => signIn()}>
      <Image className="avatar" src={githubIcon} alt="Github logo" />
      Sign in
    </button>
  );
}
