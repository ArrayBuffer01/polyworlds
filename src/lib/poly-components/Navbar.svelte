<script lang="ts">
  import { getAppContext } from "$lib/appState.svelte";

  const appState = getAppContext();
</script>

<nav class="fixed flex h-15 w-screen justify-center bg-plw-white">
  <div class="flex h-full w-300 items-center justify-between text-white">
    <!-- Aligned left -->
    <div class="flex items-center">
      <a href="#" class="flex cursor-pointer items-center p-1">
        <img src="logo.png" class="h-15 w-15 select-none" />
        <h2 class="ml-5 text-xl font-extrabold text-plw-black select-none">Polyworlds</h2>
      </a>
      <span class="w-8"></span>

      <!-- Main nav buttons -->
      <div class="flex h-full">
        <button
          class="flex h-15 cursor-pointer items-center bg-plw-white px-4 font-semibold text-plw-black transition duration-200 select-none hover:bg-neutral-150"
        >
          <i class="fa fa-gamepad"></i><span class="ml-2">Worlds</span>
        </button>
        <button
          class="flex h-15 cursor-pointer items-center bg-plw-white px-4 font-semibold text-plw-black transition duration-200 select-none hover:bg-neutral-150"
        >
          <i class="fa fa-home"></i><span class="ml-2">Groups</span>
        </button>
        <button
          class="flex h-15 cursor-pointer items-center bg-plw-white px-4 font-semibold text-plw-black transition duration-200 select-none hover:bg-neutral-150"
        >
          <i class="fa fa-shopping-basket"></i><span class="ml-2">Catalog</span>
        </button>
        <button
          class="flex h-15 cursor-pointer items-center bg-plw-white px-4 font-semibold text-plw-black transition duration-200 select-none hover:bg-neutral-150"
        >
          <i class="fa fa-group"></i><span class="ml-2">Forums</span>
        </button>
      </div>
    </div>

    <!-- Aligned right -->
    <div class="flex items-center">
      <p class="font-semibold text-plw-black">
        <i class="fa fa-fire text-amber-500"></i>
        <span class="ml-2 text-amber-500 select-none">0</span>
      </p>
      <span class="w-4"></span>
      <p class="font-semibold text-plw-black">
        <i class="fa fa-coins text-green-400"></i>
        <span class="ml-2 text-green-400 select-none">0</span>
      </p>
      <span class="w-3"></span>

      <!-- User button thingy -->
      <div class="relative" id="dropdown-wrapper">
        <button
          id="dropdown-button"
          class="flex h-15 cursor-pointer items-center p-3 font-semibold text-plw-black transition duration-200 select-none hover:bg-neutral-150"
        >
          <span>{appState.user?.username}</span>
          <img src="profile.png" class="ml-2 h-10 w-10 rounded-full border border-neutral-250" />
        </button>

        <!-- Dropdown menu -->
        <div
          id="dropdown-menu"
          class="absolute top-full right-0 z-50 mt-2 hidden w-48 -translate-y-2 scale-100 transform rounded-lg border border-neutral-250 bg-white shadow-lg transition-transform duration-150"
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
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>
