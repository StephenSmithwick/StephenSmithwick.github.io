import type { NextRequest } from "next/server";
import { createComment } from "@/app/lib/comments/access";
import { getToken } from "next-auth/jwt";
import { Anonymous, Author } from "@/app/lib/comments/definitions";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const token = await getToken({ req });
    const user = {
      ...Anonymous,
      ...(token ? { image: token.picture, name: token.name } : {}),
    } as Author;

    const newComment = await req.json();
    const lastComment = await createComment({ ...newComment, author: user });

    return new Response(
      JSON.stringify({
        lastComment,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return new Response("FAILURE", { status: 500 });
  }
}
