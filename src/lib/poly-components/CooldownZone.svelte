<script lang="ts">
  import { Cooldown } from "$lib/cooldown.svelte";
  import { onMount, type Snippet } from "svelte";

  interface CooldownProps {
    duration: number;
    children: Snippet<[Cooldown]>;
    initialTime: number | null;
  }

  const { duration, children, initialTime }: CooldownProps = $props();

  const cooldown = new Cooldown();
  cooldown.duration = duration;

  $effect(() => console.log(cooldown.initialTime));
  onMount(() => {
    cooldown.initialTime = initialTime;
    const interval = setInterval(() => cooldown.tick(), 1000);

    return () => {
      clearInterval(interval);
    }
  });
</script>

{@render children(cooldown)}
