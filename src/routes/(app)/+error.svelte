<script lang="ts">
  import { page } from "$app/state";
  import { Separator } from "$lib/components/ui/separator";

  const { status } = $derived(page);

  const errorMessages: Record<number, { message: string; title: string }> = {
    404: {
      title: "Not Found",
      message: "This page could not be found!"
    },
    403: {
      title: "Forbidden",
      message: "You don't have permission to access this page!"
    }
  };

  const errorTitle = $derived(errorMessages[status]?.title ?? "Error");

  const errorMessage: string = $derived(
    page.error?.message ?? errorMessages[status]?.message ?? "An unexpected error has occurred!"
  );
</script>

<svelte:head>
  <title>{status} | {errorTitle} | Polyworlds</title>
</svelte:head>

<div class="p-20">
  <h1 class="mb-2 text-4xl font-bold">{status} | {errorTitle}</h1>

  <Separator class="mt-2 mb-4" />

  <p class="text-muted-foreground">
    {errorMessage}
  </p>
</div>
