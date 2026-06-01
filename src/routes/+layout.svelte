<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Navbar from "$lib/poly-components/Navbar.svelte";
  import { AppState, setAppContext } from "$lib/appState.svelte";
  import LandingNav from "$lib/poly-components/LandingNav.svelte";
  import { untrack } from "svelte";

  let { children, data } = $props();

  const appState = setAppContext(new AppState(untrack(() => data.user)));

  $effect(() => {
    appState.user = data.user;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
    integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>

{#if appState.landingPageActive}
  <LandingNav />
{:else}
  <Navbar />
{/if}

<main class="grow">
  {@render children()}
</main>
