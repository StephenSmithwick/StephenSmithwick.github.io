"use client";

import Comments from "@/app/ui/Comments";
import NewComment from "@/app/ui/NewComment";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const post = useSearchParams().get("post");
  return (
    <>
      <h2>Comments</h2>
      <NewComment post={post} />
      <Comments post={post} />
    </>
  );
}
