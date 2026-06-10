<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";

  const appState = getAppContext();
  let dropdownOpen = $state(false);
</script>

<nav class="fixed flex h-15 w-screen justify-center bg-plw-red">
  <div class="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 text-white">
    <!-- Aligned left -->
    <div class="flex items-center">
      <a href={appState.user ? "/dash" : "/"} class="flex cursor-pointer items-center p-1">
        <img alt="Logo" src="/logo.png" class="h-15 w-15 select-none" />
        <h2 class="ml-5 text-xl font-extrabold text-plw-white select-none">Polyworlds</h2>
      </a>
      <span class="w-8"></span>

      <!-- Main nav buttons -->
      <div class="flex h-full">
        <a
          href="/worlds"
          class="hover:bg-plw-red-dark flex h-15 cursor-pointer items-center bg-plw-red px-4 font-semibold text-plw-white transition duration-200 select-none"
        >
          <i class="fa fa-gamepad"></i><span class="ml-2">Worlds</span>
        </a>
        <a
          href="/groups"
          class="hover:bg-plw-red-dark flex h-15 cursor-pointer items-center bg-plw-red px-4 font-semibold text-plw-white transition duration-200 select-none"
        >
          <i class="fa fa-home"></i><span class="ml-2">Groups</span>
        </a>
        <a
          href="/catalog"
          class="hover:bg-plw-red-dark flex h-15 cursor-pointer items-center bg-plw-red px-4 font-semibold text-plw-white transition duration-200 select-none"
        >
          <i class="fa fa-shopping-basket"></i><span class="ml-2">Catalog</span>
        </a>
        <a
          href="/forums"
          class="hover:bg-plw-red-dark flex h-15 cursor-pointer items-center bg-plw-red px-4 font-semibold text-plw-white transition duration-200 select-none"
        >
          <i class="fa-solid fa-comment-dots"></i><span class="ml-2">Forums</span>
        </a>
      </div>
    </div>

    <!-- Aligned right -->
    {#if appState.user}
      <div class="flex items-center">
        <p class="font-semibold text-plw-white">
          <i class="fa fa-fire text-amber-500"></i>
          <span class="ml-2 text-amber-500 select-none">{appState.user.gold}</span>
        </p>
        <span class="w-4"></span>
        <p class="font-semibold text-plw-white">
          <i class="fa fa-coins text-green-400"></i>
          <span class="ml-2 text-green-400 select-none">{appState.user.coins}</span>
        </p>
        <span class="w-3"></span>

        <!-- User button thingy -->
        <div class="relative" id="dropdown-wrapper">
          <button
            id="dropdown-button"
            class="flex h-15 cursor-pointer items-center p-3 font-semibold text-plw-white transition duration-200 select-none hover:bg-red-600"
            onclick={() => (dropdownOpen = !dropdownOpen)}
          >
            <span>{appState.user.username}</span>
            <img
              alt="Profile"
              src="/profile.png"
              class="ml-2 h-10 w-10 rounded-full border border-neutral-250"
            />
          </button>

          <!-- Dropdown menu -->
          <div
            id="dropdown-menu"
            class:hidden={!dropdownOpen}
            class="absolute top-full right-0 z-50 mt-2 w-48 -translate-y-2 scale-100 transform rounded-lg border border-neutral-250 bg-white shadow-lg transition-transform duration-150"
          >
            <ul class="text-sm text-plw-black">
              <li
                class="mt-1 cursor-pointer px-4 py-2 font-semibold text-plw-black transition duration-100 select-none hover:bg-zinc-100"
              >
                Profile
              </li>
              <li
                class="cursor-pointer px-4 py-2 font-semibold text-plw-black transition duration-100 select-none hover:bg-zinc-100"
              >
                Settings
              </li>
              <hr class="m-2 mr-5 ml-5 justify-center text-gray-200" />
              <li
                class="mb-1 cursor-pointer px-4 py-2 font-semibold text-plw-red transition duration-100 select-none hover:bg-rose-50"
              >
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </div>
</nav>
