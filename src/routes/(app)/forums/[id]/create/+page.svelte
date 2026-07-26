<script lang="ts">
  import { enhance } from "$app/forms";
  import { getAppContext } from "$lib/appState.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Spinner } from "$lib/components/ui/spinner";
  import { Textarea } from "$lib/components/ui/textarea";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
  const appState = getAppContext();

  let submitting = $state(false);
</script>

<div class="p-20">
  {#if form?.error}
    <div class="border border-plw-red p-2">
      {form.error}
    </div>
  {/if}

  <h1>Creating a post on {data.forum.name}</h1>

  <form
    action="?/post"
    method="POST"
    autocomplete="off"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        await update();
        submitting = false;
      };
    }}
  >
    <div class="flex flex-col gap-6">
      <div class="grid gap-2">
        <Label for="title">Title</Label>
        <Input
          type="text"
          name="title"
          placeholder="Title of post"
          autocomplete="off"
          required
          disabled={!appState.isLoggedIn}
        />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="postContent">Post Content</Label>
        </div>
        <Textarea
          placeholder="The content of the post goes here"
          class="min-h-40 w-full"
          disabled={!appState.isLoggedIn}
          name="postContent"
          autocomplete="off"
          required
        />
      </div>
    </div>
    <Button type="submit" class="mt-3 w-full" disabled={!appState.isLoggedIn}
      >{#if submitting}
        <Spinner />
      {/if}{appState.isLoggedIn ? "Post!" : "Login to post..."}</Button
    >
  </form>
</div>
