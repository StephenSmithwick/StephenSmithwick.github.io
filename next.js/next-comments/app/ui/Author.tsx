"use client";
import { Author } from "@/app/lib/comments/definitions";

export default function AuthorTag({ author }: { author: Author }) {
  console.log(author);
  return (
    <p className="author">
      <img className="avatar" src={author.avatar_url} alt="Author Avatar" />
      {author.name}
    </p>
  );
}
