<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
import { Separator } from "$lib/components/ui/separator";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const post = $derived(data.post);
</script>

<div class="p-20">
  <Button href="/forums/{data.forum.id}/posts/{post.post.id}/reply">Reply to this post</Button>
  <h1 class="text-2xl">{post.post.title}</h1>

  <p class="text-right">Posted by {post.user?.username}</p>

  <Separator class="mb-4" />

  <p>{post.post.content}</p>
  <Separator class="mt-2 mb-2" />
  <h1 class="text-2xl">Replies:</h1>

  <div class="mt-4">
    {#each data.replies as reply (reply.reply.id)}
      <h1 class="text-2xl">{reply.user?.username} said:</h1>
      <p>{reply.reply.content}</p>
      <Separator />
    {/each}
  </div>
</div>
