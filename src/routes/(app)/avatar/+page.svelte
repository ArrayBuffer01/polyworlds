<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Alert from "$lib/components/ui/alert/index";
  import type { PageProps } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import { Spinner } from "$lib/components/ui/spinner";
  import type { AvatarColors } from "$lib/server/avatarRenderer";
  let { data, form }: PageProps = $props();
  let saving = $state(false);
  const parts = ["Head", "Torso", "RightArm", "LeftArm", "RightLeg", "LeftLeg"] as const;

  const colors = $derived<AvatarColors>(form?.colors ?? data.colors);

  const avatarUrl = $derived(form?.avatarUrl ?? data.avatarUrl);
  const headshotUrl = $derived(form?.headshotUrl ?? data.headshotUrl);
  const labels: AvatarColors = {
    Head: "Head",
    Torso: "Torso",
    RightArm: "Right arm",
    LeftArm: "Left arm",
    RightLeg: "Right leg",
    LeftLeg: "Left leg"
  };
</script>

<svelte:head><title>Avatar Editor | Polyworlds</title></svelte:head>
<main class="container mx-auto max-w-4xl p-20">
  {#if !data.isRendererUp}
    <Alert.Root variant="destructive" class="mb-4">
      <Alert.Title>Avatar rendering down</Alert.Title>
      <Alert.Description>
        <p>Polyworlds renderer is currently not available. Please try again later.</p>
      </Alert.Description>
    </Alert.Root>
  {/if}
  <div class="rounded border p-6 hover:border-plw-red">
    <h1 class="text-3xl font-light">Edit your avatar</h1>
    <p class="mt-2 text-muted-foreground">For now colors only I guess</p>

    <div class="mt-6 grid gap-8 md:grid-cols-[1fr_260px]">
      <form
        method="POST"
        action="?/save"
        class="grid gap-4 sm:grid-cols-2"
        use:enhance={() => {
          saving = true;
          return async ({ update }) => {
            await update({ reset: false });
            saving = false;
          };
        }}
      >
        {#each parts as part (part)}
          <label class="flex items-center justify-between gap-4 rounded border p-3"
            ><span class="font-semibold">{labels[part]}</span><input
              class="h-10 w-20 cursor-pointer rounded border"
              type="color"
              name={part}
              bind:value={colors[part]}
            /></label
          >
        {/each}
        {#if form?.error}<p class="text-sm text-destructive">{form.error}</p>{/if}
        {#if form?.success}<p class="text-sm text-green-600">Avatar updated</p>{/if}
        <Button type="submit" disabled={saving} class="sm:col-span-2"
          >{#if saving}<Spinner />{/if}Save avatar</Button
        >
      </form>
      <div class="flex flex-col items-center gap-4">
        <p class="font-semibold">Full avatar</p>
        {#if avatarUrl}<img
            src={avatarUrl}
            alt="Full avatar preview"
            class="h-48 w-48 rounded-2xl object-contain"
          />{/if}
        <p class="font-semibold">Headshot</p>
        {#if headshotUrl}<img
            src={headshotUrl}
            alt="Headshot preview"
            class="h-24 w-24 rounded-full object-cover"
          />{/if}
      </div>
    </div>
  </div>
</main>
