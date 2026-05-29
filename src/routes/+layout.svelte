<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Navbar from "$lib/poly-components/Navbar.svelte";
  import { AppState, setAppContext } from "$lib/appState.svelte";

  let { children } = $props();

  const appState = setAppContext(new AppState());

  appState.user = {
    username: "Array"
  };
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar />

<main class="container mx-auto w-full grow p-20">
  {@render children()}
</main>
