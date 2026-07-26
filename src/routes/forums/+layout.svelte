<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import Construction from "$lib/poly-components/Construction.svelte";
  import { UserRole } from "../../types/User";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();

  const appState = getAppContext();
</script>

{#if !appState.isLoggedIn || appState.user?.role != UserRole.Admin}
  <Construction title="FORUM IS BEING REDESIGNED!" />
{:else}
  {@render children()}
{/if}
