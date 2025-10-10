import type { Component } from "solid-js";

import styles from "./App.module.css";
import Comments from "./ui/Comments";
import { default as CommentForm, CommentsUpdated } from "./ui/CommentForm";
import { createSignal } from "solid-js";

const CommentBlock: Component = () => {
  const post = window.POST_SLUG || "default"; //todo: useSearchParams().get("post") ||
  console.log(`Fetching comments for: ${post}`);
  const [lastComment, setLastComment] = createSignal<number>(0);

  const commentsUpdated: CommentsUpdated = (id: number) => {
    setLastComment(id);
  };

  return (
    <div id="comment-section" class={styles.App}>
      <h2>Comments</h2>
      {/*<CommentForm post={post} onUpdate={commentsUpdated} />*/}
      <Comments post={post} lastComment={lastComment()} />
    </div>
  );
};

export default CommentBlock;
