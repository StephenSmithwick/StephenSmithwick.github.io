"use client";

import { useSession } from "next-auth/react";
import CurrentUser from "./CurrentUser";

export default function NewComment({ post }: { post: string }) {
  const { data: session } = useSession();

  async function postComment(form: FormData) {
    const user = session?.user
      ? {
          name: session.user.name,
          avatar_url: session.user.image,
        }
      : {
          name: "Anonymous",
          avatar_url: "https://github.com/identicons/stephensmithwick.png",
        };

    fetch("api/comments", {
      method: "POST",
      body: JSON.stringify({
        post: post,
        author: user,
        text: `${form.get("text")}`,
      }),
    });
  }

  return (
    <form className="comment-form" action={postComment}>
      <textarea name="text" placeholder="Leave a comment…" required></textarea>
      <div className="comment-actions">
        <button type="submit">Post</button> as <CurrentUser />
      </div>
    </form>
  );
}
