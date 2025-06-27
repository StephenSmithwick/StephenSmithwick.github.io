import postgres from "postgres";
import { Author, Comment, CommentRow } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchPostComments(post: string): Promise<Comment[]> {
  try {
    await setupComment();
    const comments = await sql<CommentRow[]>`SELECT
        id, date, post, text, author, avatar_url
      FROM comment
      WHERE comment.post = ${post}
      ORDER BY comment.id ASC
      LIMIT 1000`;
    return comments.map(to_comment);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest comments.");
  }
}

export async function createComment({
  post,
  author,
  text,
}: {
  post: string;
  author: Author;
  text: string;
}) {
  try {
    await setupComment();
    await sql`INSERT INTO comment (post, author, avatar_url, text, date )
      VALUES (${post}, ${author.name}, ${author.avatar_url}, ${text}, current_timestamp);`;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to insert comment.");
  }
}

async function setupComment() {
  await sql`
    CREATE TABLE IF NOT EXISTS comment (
      id SERIAL PRIMARY KEY,
      date TIMESTAMP NOT NULL,
      post VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      author TEXT NOT NULL,
      avatar_url TEXT
    );
  `;
}

function to_comment(res: CommentRow): Comment {
  return {
    ...res,
    author: {
      name: res.author,
      avatar_url: res.avatar_url,
    },
  };
}
