"use client";

import { useSession } from "next-auth/react";
import Login from "./Login";

export default function NewComment({
  post,
  onUpdate,
}: {
  post: string;
  onUpdate: CommentsUpdated;
}) {
  const { data: session } = useSession();
  return (
    <form className="comment-form" action={postComment(post, onUpdate)}>
      <textarea name="text" placeholder="Leave a comment…" required></textarea>
      <div className="comment-actions">
        <button type="submit">Post</button> as <Login session={session} />
      </div>
    </form>
  );
}

export type CommentsUpdated = (lastComment: number) => void;

function postComment(post: string, onUpdate: CommentsUpdated) {
  return async function postComment(form: FormData) {
    console.log(
      JSON.stringify({
        post: post,
        text: `${form.get("text")}`,
      }),
    );
    const response = await fetch("api/comments", {
      method: "POST",
      body: JSON.stringify({
        post: post,
        text: `${form.get("text")}`,
      }),
    });
    onUpdate((await response.json()).lastComment);
  };
}
