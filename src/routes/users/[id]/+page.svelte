<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<h1 class="p-20">
  {data.target.username}
</h1>
