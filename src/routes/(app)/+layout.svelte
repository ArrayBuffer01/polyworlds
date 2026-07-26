<script lang="ts">
  import Navbar from "$lib/poly-components/Navbar.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<Navbar />
{@render children()}
