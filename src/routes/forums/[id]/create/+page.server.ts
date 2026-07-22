import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { forumPostsTable } from "$lib/server/db/schema";

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
  post: async ({ request, locals, params }) => {
    const formData = await request.formData();

    if (!locals.user) {
      return fail(400, { success: false, error: "You must be logged in to post posts!" });
    }

    const title = formData.get("title");
    const postContent = formData.get("postContent");

    if (!title || title.toString().trim() === "") {
      return fail(400, { success: false, error: "You must enter a title!" });
    }

    if (!postContent || postContent.toString().trim() === "") {
      return fail(400, { success: false, error: "Please enter your post content." });
    }

    const post = await db
      .insert(forumPostsTable)
      .values({
        content: postContent.toString(),
        forumId: parseInt(params.id ?? "0"),
        title: title.toString(),
        userId: locals.user.id
      })
      .returning();
    
    console.log(post);
    return redirect(301, "/forums/" + params.id + "/posts/" + post[0].id);
  }
};
