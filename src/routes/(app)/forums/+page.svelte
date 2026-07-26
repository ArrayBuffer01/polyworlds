<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<div class="p-20">
  {#if data.forums.length < 1}
    <h1>No Forums Found.</h1>
  {:else}
    <div class="flex flex-col gap-2">
      {#each data.forums as forum (forum.id)}
        <div class="border border-plw-red">
          <a href="/forums/{forum.id}">{forum.name}</a>
        </div>
      {/each}
    </div>
  {/if}
</div>
