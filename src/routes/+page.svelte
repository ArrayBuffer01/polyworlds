<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Landing | Polyworlds</title>
</svelte:head>

<div
  class="flex h-screen items-center justify-center bg-[url(https://cdn.xsolla.net/80.lv/uploads/2016/12/environment_8.jpg)] bg-cover bg-black/40"
>
  <div>
    <div
      class="flex w-sm flex-col space-y-3 rounded-md border border-neutral-250 bg-plw-black/45 p-5 pl-6"
    >
      <div class="flex w-full">
        <div class="h-20 w-2/3">
          <p class="font-bold text-plw-white">Where will your imagination take you?</p>
          <p class="text-[15px] text-plw-gray">Join over 69 users that are creating, playing, selling, trading, and much, much more.</p>
        </div>
      </div>

      <a class="w-full rounded-md bg-plw-red p-1.5 text-center text-white" href="/login">Login</a>
      <a class="w-full rounded-md bg-plw-red p-1.5 text-center text-white" href="/signup">Signup</a>
    </div>
  </div>
</div>
