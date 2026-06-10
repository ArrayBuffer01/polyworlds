<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import type { PageProps } from "./$types";
  import { postFeed, getFeeds } from "./feed.remote";
  import * as Field from "$lib/components/ui/field/index";
  import { Textarea } from "$lib/components/ui/textarea/index";
  import { Button } from "$lib/components/ui/button";
  import { Spinner } from "$lib/components/ui/spinner";
  import * as Card from "$lib/components/ui/card";
  import { ONE_DAY } from "$lib/constants";
  import { claimReward } from "./dash.remote";
  import { browser } from "$app/env";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import { Separator } from "$lib/components/ui/separator";
  import * as Dialog from "$lib/components/ui/dialog";

  let { data }: PageProps = $props();

  // Modal state
  let open = $state(false);

  // Daily Reward states
  let now = $state(Date.now());
  let rewardPending = $state(false);
  let lastReward = $derived(data.lastReward?.getTime() || 0);
  const msUntilNextReward = $derived(!lastReward ? 0 : Math.max(0, lastReward + ONE_DAY - now));
  const rewardAvailable = $derived<boolean>(!lastReward || msUntilNextReward === 0);
  const countdown = $derived.by(() => {
    if (rewardAvailable) return null;

    const totalSeconds = Math.ceil(msUntilNextReward / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} h ${minutes} min ${seconds} s`;
  });

  let submitting = $state(false);
  let intv: NodeJS.Timeout;

  function setupIntv() {
    intv = setInterval(() => {
      now = Date.now();
    }, 1000);
  }

  function clearIntv() {
    clearInterval(intv);
  }

  $effect(() => {
    if (!browser) return;

    if (rewardAvailable) {
      clearIntv();
      open = true;
    } else {
      setupIntv();
    }
  });

  onMount(() => {
    return () => {
      if (intv) clearInterval(intv);
    };
  });

  async function claim() {
    const result = await claimReward();
    if (result.success && result.lastReward && appState.user) {
      // Update currency
      /*appState.user.coins = result.coins;
      appState.user.gold = result.gold;*/

      // For now invalidate all page data. It's fine!
      await invalidateAll();
    }

    return result;
  }

  const appState = getAppContext();
</script>

<svelte:head>
  <title>Dashboard | Polyworlds</title>
</svelte:head>

<div class="mx-auto flex flex-col gap-6 p-20 lg:flex-row">
  <aside class="flex-1">
    <!-- Left side -->
    <div class="flex items-center gap-2">
      <img src="/profile.png" alt="Profile" class="h-16 w-16 rounded-full" />
      <h1 class="scroll-m-20 text-3xl font-light tracking-tight transition-colors first:mt-0">
        Welcome, {appState.user?.username}
      </h1>
    </div>

    <Dialog.Root bind:open>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Daily Reward</Dialog.Title>
          <Dialog.Description>
            Your Daily Reward is available for claim! You can claim it now or later!
            <Button
            class="mt-2 w-full"
            onclick={async () => {
              await claim();
              open = false;
            }}>Claim Reward</Button
          >
          <Button
            class="mt-2 w-full"
            variant="secondary"
            onclick={async () => {
              await claim();
              open = false;
            }}>Not Now</Button
          >
          </Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>

    <Separator class="mt-2" />
    
    <Card.Root class="mt-4 rounded">
      <Card.Header>
        <Card.Title class="border-b text-center">Daily Reward</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if rewardAvailable}
          Reward available. Claim it using the button below.
        {:else if countdown}
          Next Reward available in:
          {countdown}
        {/if}
        {#if rewardAvailable}
          <Button
            class="mt-2 w-full"
            onclick={async () => {
              await claim();
            }}>Claim Reward</Button
          >
        {/if}
      </Card.Content>
    </Card.Root>
  </aside>

  <!-- Middle -->
  <main class="flex-2">
    <h1
      class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-light tracking-tight transition-colors first:mt-0"
    >
      User Feed
    </h1>
    <form
      class="mb-3"
      {...postFeed.enhance(async ({ submit, element }) => {
        submitting = true;
        try {
          if (await submit()) {
            element.reset();
          } else {
            console.log("Hmmm!", postFeed.fields.content.issues());
          }
        } catch (err) {
          // TODO handle the error lmfao
          console.log(err);
        } finally {
          submitting = false;
        }
      })}
    >
      <div class="mt-2 w-full">
        <Field.Set>
          <Field.Group>
            <Field.Field>
              <Textarea
                {...postFeed.fields.content.as("text")}
                id="feedText"
                class="rounded"
                disabled={submitting}
                placeholder="What's on your mind?"
                rows={4}
              />
            </Field.Field>
            {const issues = $derived(postFeed.fields.content.issues());}
            {#if issues && issues.length}
              {#each issues as issue (issue)}
                <p class="text-red-500">{issue.message}</p>
              {/each}
            {/if}
          </Field.Group>

          <Field.Group>
            <Field.Field>
              <Button variant="default" disabled={submitting} type="submit">
                {#if submitting}
                  <Spinner /> Posting...
                {:else}
                  Post
                {/if}
              </Button>
            </Field.Field>
          </Field.Group>
        </Field.Set>
      </div>
    </form>

    <div class="space-y-4">
      {#each await getFeeds() as { user, feed } (feed.id)}
        <div class="overflow-hidden rounded border hover:border-plw-red">
          <div class="px-5 pt-4">
            <div>
              <a href="/users/{user.id}">
                <div class="flex gap-2">
                  <img
                    alt="Profile"
                    src="/profile.png"
                    class="h-10 w-10 rounded-full border border-plw-gray"
                  />
                  <div class="font-semibold">
                    <span class="hover:underline">{user.username}</span>
                  </div>
                  <div>
                    <span class="text-sm">{feed.createdAt.toLocaleTimeString()}</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="pt-2 pb-2">
              {feed.content}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </main>

  <aside class="flex-1">
    <h1
      class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-light tracking-tight transition-colors first:mt-0"
    >
      Coming Soon
    </h1>
  </aside>
</div>
