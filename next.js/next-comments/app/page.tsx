"use client";

import Comments from "@/app/ui/Comments";
import CommentForm from "@/app/ui/CommentForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <CommentBlock />
    </Suspense>
  );
}

function CommentBlock() {
  const post = useSearchParams().get("post") || "default";

  return (
    <div id="comment-section">
      <Header />
      <CommentForm post={post} />
      <Comments post={post} />
    </div>
  );
}

const Header = () => <h2>Comments</h2>;

const Loading = () => (
  <>
    <Header />
    <ul className="loading comment-list">
      <li>Loading</li>
    </ul>
  </>
);
