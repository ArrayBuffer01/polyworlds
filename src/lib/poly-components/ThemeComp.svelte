<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import { untrack } from "svelte";

  const { initialTheme }: { initialTheme: string } = $props();

  const appState = getAppContext();

  appState.theme = untrack(() => initialTheme);
</script>
