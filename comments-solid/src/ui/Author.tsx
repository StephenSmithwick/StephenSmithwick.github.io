import { Author } from "../lib/comments/definitions";

export default function AuthorTag({ author }: { author: Author }) {
  return (
    <span class="author">
      <img class="avatar" src={author.image} alt="Author Image" />
      {author.name}
    </span>
  );
}
