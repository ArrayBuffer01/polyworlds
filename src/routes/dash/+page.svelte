<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import { postFeed, getFeeds } from "./feed.remote";
  import * as Field from "$lib/components/ui/field/index";
  import { Textarea } from "$lib/components/ui/textarea/index";
  import { Button } from "$lib/components/ui/button";
  import { Spinner } from "$lib/components/ui/spinner";
  import * as Card from "$lib/components/ui/card";
  import { claimReward } from "./dash.remote";
  import { browser } from "$app/env";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import { Separator } from "$lib/components/ui/separator";
  import * as Dialog from "$lib/components/ui/dialog";
  import UserFeed from "$lib/poly-components/UserFeed.svelte";
  import UserLock from "@lucide/svelte/icons/user-lock";
  import House from "@lucide/svelte/icons/house";
  import { DailyRewardState, setRewardContext } from "$lib/dailyReward.svelte";
  import { page } from "$app/state";


  // Modal state
  let open = $state(false);

  // Daily Reward states
  const rewardState = setRewardContext(new DailyRewardState());

  let submitting = $state(false);
  let intv: NodeJS.Timeout;

  function setupIntv() {
    intv = setInterval(() => {
      rewardState.tick();
    }, 1000);
  }

  function clearIntv() {
    clearInterval(intv);
  }

  $effect(() => {
    if (!browser) return;
    
    if (rewardState.rewardAvailable) {
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

{#if !appState.isLoggedIn}
  <div class="p-20 flex flex-col items-center justify-center w-full gap-4">
    {const loggedOutMessage = $derived(page.url.searchParams.get("logged_out") === "true")}
     {#if loggedOutMessage}
      <h1 class="flex text-2xl border p-2 text-center w-fit items-center justify-center bg-green-500 rounded text-white">You have been logged out!</h1>
    {/if}
  <div class="flex justify-center w-full">
  
    <div class="hover:border-plw-red border p-5 rounded w-full max-w-md">
      <h1 class="text-2xl mb-2">
        <UserLock class="inline-block" />
        Login or sign up to access the dashboard
      </h1>
      <div class="flex flex-col w-full gap-2">
        <a href="/login" class="w-full rounded-md bg-plw-red p-1.5 text-center text-white">Login</a>
        <a href="/signup" class="w-full rounded-md bg-plw-red p-1.5 text-center text-white">Sign up</a>
        <Separator class="mt-4" />
        <a href="/" class="w-full rounded-md bg-plw-red p-1.5 text-center text-white"><House class="inline-block" /> Landing</a>
      </div>
    </div>
  </div>
  </div>
{/if}


{#if appState.isLoggedIn}
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
        {#if rewardState.rewardAvailable}
          Reward available. Claim it using the button below.
          <Button
            class="mt-2 w-full"
            onclick={async () => {
              await claim();
            }}>Claim Reward</Button
          >
        {:else if rewardState.countdown}
          Next Reward available in:
          {rewardState.countdown}
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
        <UserFeed user={user} feed={feed} />
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

{/if}