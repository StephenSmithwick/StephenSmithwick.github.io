"use client";

import { useSession } from "next-auth/react";
import Login from "./Login";
import { Anonymous, Author } from "../lib/comments/definitions";

export default function NewComment({ post }: { post: string }) {
  const { data: session } = useSession();
  const user = { ...Anonymous, ...session?.user } as Author;

  return (
    <form className="comment-form" action={postComment(post, user)}>
      <textarea name="text" placeholder="Leave a comment…" required></textarea>
      <div className="comment-actions">
        <button type="submit">Post</button> as <Login session={session} />
      </div>
    </form>
  );
}

function postComment(post: string, user: Author) {
  return async function postComment(form: FormData) {
    fetch("api/comments", {
      method: "POST",
      body: JSON.stringify({
        post: post,
        author: user,
        text: `${form.get("text")}`,
      }),
    });
  };
}
