<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<div class="p-20">
  <h1>Creating a post on {data.forum.name}</h1>
</div>
