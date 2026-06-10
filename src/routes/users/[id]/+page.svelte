<script lang="ts">
  import { page } from "$app/state";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const profile = $derived(data.profile);

  const tabs = [
    {
      tabId: "main",
      name: "Main Profile",
      default: true
    },
    {
      tabId: "comments",
      name: "Profile Comments"
    }
  ];

  const defaultTab = tabs[0];

  const currentTab = $derived.by(() => {
    const tab = page.url.searchParams.get("tab")
      ? (tabs.find((tab) => tab.tabId === page.url.searchParams.get("tab"))?.tabId ??
        defaultTab.tabId)
      : defaultTab.tabId;
    return tab;
  });
</script>

<main class="container w-full p-20">
  <div class="mt-6 grid grid-cols-1 gap-2 lg:grid-cols-2">
    <div>
      <div class="rounded border p-4 hover:border-plw-red">
        <div>
          {profile.username}
        </div>
        <div class="mt-2">
          <img src="/profile.png" alt="Profile" />
        </div>

        <h3 class="mt-4 font-extrabold">About {profile.username}</h3>
        <div class="mt-2">
          {profile.bio ? profile.bio : ""}
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col">
      <div class="flex gap-2">
        {#each tabs as tab (tab.tabId)}
          <a
            class="border-b-2 border-plw-red bg-accent px-4 py-2 text-center"
            class:border-plw-red={currentTab === tab.tabId}
            href="?tab={tab.tabId}">{tab.name}</a
          >
        {/each}
      </div>

      <div class="flex-1 p-2">
        {#if currentTab === "main"}
          <div class="rounded border p-4">
            <div>
              <span class="font-semibold">Medals</span>
            </div>

            <div class="flex gap-3">
              {#if profile.medals.length}
                {#each profile.medals as medal (medal.id)}
                  <img src={medal.imageURL} class="h-16 w-16" alt={medal.name} />
                {/each}
              {:else}
                <p>{profile.username} does not have medals.</p>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
