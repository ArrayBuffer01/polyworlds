<script lang="ts">
  import { page } from "$app/state";
  import "./layout.css";
  import favicon from "$lib/assets/favicon.png";
  import Navbar from "$lib/poly-components/Navbar.svelte";
  import { AppState, setAppContext } from "$lib/appState.svelte";
  import LandingNav from "$lib/poly-components/LandingNav.svelte";
  import { untrack } from "svelte";
  import ThemeComp from "$lib/poly-components/ThemeComp.svelte";

  let { children, data } = $props();

  const appState = setAppContext(new AppState(untrack(() => data.user)));

  $effect(() => {
    appState.user = data.user;
  });
</script>

<ThemeComp initialTheme={data.theme} />

<svelte:head>
  <script>
    (function () {
      const themeCookie = document.cookie.match(/theme=(light|dark)/)?.[1];
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (themeCookie === "dark") {
        document.documentElement.classList.add("dark");
      }
    })();
  </script>
  <link rel="icon" href={favicon} />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
    integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>

{#if page.url.pathname != "/login" && page.url.pathname != "/signup" && page.url.pathname != "/"}
  {#if appState.landingPageActive}
    <LandingNav />
  {:else}
    <Navbar />
  {/if}
{/if}

<main class="grow">
  {@render children()}
</main>
