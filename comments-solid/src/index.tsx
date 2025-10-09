/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import CommentBlock from "./CommentBlock";

const root = document.getElementById("comments");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => <CommentBlock />, root!);
