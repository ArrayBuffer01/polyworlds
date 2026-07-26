<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import { Button } from "$lib/components/ui/button";
  import type { LayoutProps } from "./$types";
  import Sun from "@lucide/svelte/icons/sun";
  import Moon from "@lucide/svelte/icons/moon";

  let { children }: LayoutProps = $props();
  const appState = getAppContext();
</script>

<Button
  class="fixed right-6 bottom-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center border bg-accent-foreground shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
  onclick={() => appState.toggleTheme()}
  >
    {#if appState.theme === "dark"}
      <Sun class="text-accent" />
    {:else}
      <Moon class="text-accent" />
    {/if}
  </Button
>

{@render children()}
