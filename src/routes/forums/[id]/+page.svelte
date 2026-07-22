<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import { Button } from "$lib/components/ui/button";
  import type { PageProps } from "./$types";

  const appState = getAppContext();
  let { data }: PageProps = $props();
</script>

<div class="p-20">
  {#if appState.isLoggedIn}
    <Button href="/forums/{data.forum.id}/create">Create Post</Button>
  {/if}

  {#if data.posts.length < 1}
    <h1>No posts found on this forum.</h1>
  {:else}
    <div class="flex flex-col gap-2">
      {#each data.posts as post (post.forum_posts.id)}
        <div class="border border-plw-red">
          <a href="/forums/{post.forum_posts.id}">{post.forum_posts.title}</a>
          <p>By {post.user?.username}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
