<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import type { PageProps } from "./$types";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Spinner } from "$lib/components/ui/spinner";

  let { data }: PageProps = $props();

  const appState = getAppContext();
</script>

<svelte:head>
  <title>Landing | Polyworlds</title>
</svelte:head>

<div
  class="flex h-screen items-center justify-center
         bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)]
         [background-size:20px_20px]"
>
  <Card.Root class="-my-4 w-full max-w-sm">
    <Card.Header>
      <Card.Title class="flex items-center justify-center font-super-bouncer text-plw-red text-4xl">POLYWORLDS!</Card.Title>
      <Card.Description class="font-semibold text-plw-text">We're back!</Card.Description>
      <Card.Description>Polyworlds is releasing in a public beta. Create your own avatar, chat with people from around the world, make new friends, and be part of a growing community.</Card.Description>
      <Card.Description>We're just getting started, and we'd love to have you join us as Polyworlds continues to grow.</Card.Description>
    </Card.Header>
    <Card.Content class="flex">
      {#if !appState.user}
        <a class="w-full rounded-md bg-plw-red py-2 px-6 text-center font-medium text-white mr-2" href="/login">Login</a>
        <a class="w-full rounded-md bg-plw-red py-2 px-6 text-center font-medium text-white" href="/signup"
          >Signup</a>
      {:else}
        <a class="w-full rounded-md bg-plw-red py-2 px-6 text-center font-medium text-white" href="/dash">Dashboard <ChevronRight class="inline-block" /></a>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
