<script lang="ts">
  import { themeState } from "$lib/theme.svelte";
  import { onMount } from "svelte";

  onMount(async () => {
    themeState.theme = (await cookieStore.get("theme"))?.value ?? "dark";
  });
</script>
