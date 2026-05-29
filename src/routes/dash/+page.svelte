<script lang="ts">
    import { getAppContext } from "$lib/appState.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const appState = getAppContext();
</script>

<h2 class="text-4xl">Hello, {appState.user?.username}</h2>