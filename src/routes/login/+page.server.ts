import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { invalidateAll } from "$app/navigation";

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();

    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();

    if (username === "ARRAY" && password === "123") {
      cookies.set("auth", "ARRAY", {
        path: "/"
      });
      console.log("Pass");
      return redirect(300, "/dash");
    }
  }
} satisfies Actions;
