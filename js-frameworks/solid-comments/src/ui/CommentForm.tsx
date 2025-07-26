import { Anonymous, Author } from "../lib/comments/definitions";
import { ErrorBoundary } from "solid-js";
import env from "../lib/comments/env";

export default function NewComment({
  post,
  onUpdate,
}: {
  post: string;
  onUpdate: CommentsUpdated;
}) {
  const user = { ...Anonymous } as Author;

  return (
    <ErrorBoundary fallback={(err) => <p>Error posting: {err()}</p>}>
      <form class="comment-form" onSubmit={() => postComment(post, onUpdate)}>
        <textarea
          name="text"
          placeholder="Leave a comment…"
          required
        ></textarea>
        <div class="comment-actions">
          <button type="submit">Post</button>
        </div>
      </form>
    </ErrorBoundary>
  );
}

export type CommentsUpdated = (lastComment: number) => void;

function postComment(post: string, onUpdate: CommentsUpdated) {
  return async function postComment(form: FormData) {
    console.log(`POST: ${env.API_HOST}/api/comments`, {
      post: post,
      text: `${form.get("text")}`,
    });
    const response = await fetch(`${env.API_HOST}/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        post: post,
        text: `${form.get("text")}`,
      }),
    });
    onUpdate((await response.json()).lastComment);
  };
}
