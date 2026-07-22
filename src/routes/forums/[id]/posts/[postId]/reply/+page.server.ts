import { db } from "$lib/server/db";
import { forumPostRepliesTable, forumPostsTable } from "$lib/server/db/schema";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
  replyPost: async ({ request, locals, params }) => {
    const formData = await request.formData();

    if (!locals.user) {
      return fail(400, { success: false, error: "You must be logged in to reply to posts!" });
    }

    const replyContent = formData.get("replyContent");

    if (!replyContent || replyContent.toString().trim() === "") {
      return fail(400, { success: false, error: "Please enter your reply content." });
    }

    const reply = await db
      .insert(forumPostRepliesTable)
      .values({
        content: replyContent.toString(),
        postId: parseInt(params.postId ?? "0"),
        userId: locals.user.id
      })
      .returning();

    console.log(reply);
    return redirect(301, "/forums/" + params.id + "/posts/" + params.postId);
  }
};
