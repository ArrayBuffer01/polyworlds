<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import { onMount } from "svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const appState = getAppContext();
</script>

<svelte:head>
  <title>Dashboard | Polyworlds</title>
</svelte:head>

<div class="container mx-auto p-20">
  <h1 class="text-3xl font-bold">Dashboard</h1>
  <p class="text-lg">Welcome, {appState.user?.username}!</p>
</div>
