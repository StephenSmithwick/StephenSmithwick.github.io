import Author from "./Author";

import { Comment } from "../lib/comments/definitions";
import env from "../lib/comments/env";

import { remark } from "remark";
import html from "remark-html";

import { createSignal, onMount, For, Show } from "solid-js";

export default function Comments({
  post,
  lastComment,
}: {
  post: string;
  lastComment?: number;
}) {
  const [comments, setComments] = createSignal<Comment[]>([]);
  const [loaded, setLoaded] = createSignal<boolean>(false);
  const remarkHtml = remark().use(html);

  function reloadComments() {
    const fetchData = async () => {
      console.log(`REQUEST: ${env.API_HOST!}/api/comments/${post}`);
      const request = await fetch(`${env.API_HOST!}/api/comments/${post}`);
      const newComments: Comment[] = await Promise.all<Comment[]>(
        (await request.json()).map(
          async (comment: Comment): Promise<Comment> => ({
            ...comment,
            text: (await remarkHtml.process(comment.text)).toString(),
          }),
        ),
      );

      setComments(newComments);
      setLoaded(true);
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching comments.", e);
    });
  }
  onMount(async () => reloadComments());

  return (
    <Show when={loaded()} fallback={<Loading />}>
      <ul class="comment-list">
        <For each={comments()}>
          {(comment, i) => (
            <li class="comment">
              <div class="comment-body" innerHTML={comment.text} />
              <div class="comment-meta">
                — <Author author={comment.author} /> • {`${comment.date}`}
              </div>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}

function Loading() {
  return (
    <ul class="loading comment-list">
      <li>Loading...</li>
    </ul>
  );
}
