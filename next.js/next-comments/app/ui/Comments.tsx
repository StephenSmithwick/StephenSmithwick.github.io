"use client";

import React, { useState, useEffect } from "react";
import Author from "./Author";

import { Comment } from "@/app/lib/comments/definitions";
import { remark } from "remark";
import html from "remark-html";

export default function Comments({ post }: { post: string }) {
  const [comments, setData] = useState<Comment[]>([]);
  const remarkHtml = remark().use(html);

  useEffect(() => {
    const fetchData = async () => {
      const request = await fetch(`/api/comments/${post}`);
      const comments: Comment[] = await Promise.all<Comment[]>(
        (await request.json()).map(
          async (comment: Comment): Promise<Comment> => ({
            ...comment,
            text: (await remarkHtml.process(comment.text)).toString(),
          }),
        ),
      );

      setData(comments);
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching comments.", e);
    });
  }, []);

  return comments ? (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li className="comment" key={comment.id}>
          <div
            className="comment-body"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
          <div className="comment-meta">
            — <Author author={comment.author} /> • {`${comment.date}`}{" "}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <ul className="comment-list">
      <li className="loading">Loading</li>
    </ul>
  );
}
