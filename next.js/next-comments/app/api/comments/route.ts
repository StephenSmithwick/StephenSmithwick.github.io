import type { NextRequest } from "next/server";
import { createComment, fetchPostComments } from "@/app/lib/comments/access";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const newComment = await request.json();
    await createComment(newComment);

    return new Response(
      JSON.stringify(await fetchPostComments(newComment.post)),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return new Response("FAILURE", { status: 500 });
  }
}
