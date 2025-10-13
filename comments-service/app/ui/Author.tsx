"use client";
import { Author } from "@/app/lib/comments/definitions";

export default function AuthorTag({ author }: { author: Author }) {
  return (
    <span className="author">
      <img className="avatar" src={author.image} alt="Author Image" />
      {author.name}
    </span>
  );
}
