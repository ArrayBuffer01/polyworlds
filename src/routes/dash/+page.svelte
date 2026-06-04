<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";
  import type { PageProps } from "./$types";
  import { postFeed, getFeeds } from "./feed.remote";
  import * as Field from "$lib/components/ui/field/index";
  import { Textarea } from "$lib/components/ui/textarea/index";
  import { Button } from "$lib/components/ui/button";
  import { Spinner } from "$lib/components/ui/spinner";
  import * as Card from "$lib/components/ui/card";

  let { data }: PageProps = $props();
  let submitting = $state(false);

  const appState = getAppContext();
</script>

<svelte:head>
  <title>Dashboard | Polyworlds</title>
</svelte:head>

<div class="container mx-auto grid grid-cols-3 gap-8 p-4">
  <aside>
    <!-- Left side -->
    <h1
      class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Welcome, {appState.user?.username}
    </h1>

    <Card.Root class="mt-2">
      <Card.Header>
        <Card.Title class="border-b">Daily Reward</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Next Reward in 69h</p>
      </Card.Content>
    </Card.Root>
  </aside>

  <!-- Middle -->
  <main>
    <form
      {...postFeed.enhance(async ({ submit, element }) => {
        submitting = true;
        try {
          if (await submit()) {
            element.reset();
          }
        } catch (err) {
          // TODO handle the error lmfao
        } finally {
          submitting = false;
        }
      })}
    >
      <div class="w-full max-w-md">
        <Field.Set>
          <Field.Group>
            <Field.Field>
              <Field.Label for="feedText">Create new feed</Field.Label>
              <Textarea
                {...postFeed.fields.content.as("text")}
                id="feedText"
                disabled={submitting}
                placeholder="What's on your mind?"
                rows={4}
              />
            </Field.Field>
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

    {#each await getFeeds() as { user, feed } (feed.id)}
      <div class="my-4 rounded border bg-plw-red p-4 text-plw-white">
        <p>{feed.content}</p>
        <small class="text-sm">Posted by {user.username}</small>
      </div>
    {/each}
  </main>

  <aside>Test!</aside>
</div>
