<script lang="ts">
  import { page } from "$app/state";
  import { Separator } from "$lib/components/ui/separator";
  import type { PageProps } from "./$types";
  import * as Empty from "$lib/components/ui/empty/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
  import Medal from "@lucide/svelte/icons/medal";

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
    <div class="flex flex-col gap-4">
      <div class="rounded border p-4 hover:border-plw-red">
        <div class="mt-2 flex items-center gap-4">
          <img src="/profile.png" alt="Profile" class="shrink-0 rounded-2xl" />
          <h2 class="ml-4 text-2xl font-light">{profile.username}</h2>
        </div>

        <h3 class="mt-4 font-extrabold">About {profile.username}</h3>
        <div class="mt-2">
          {profile.bio ? profile.bio : "No bio yet."}
        </div>
      </div>
      <div class="rounded border pr-4 pb-4 pl-4 hover:border-plw-red">
        <h3 class="mt-4 font-extrabold">{profile.username}'s Stats</h3>
        <Separator class="mt-1 mb-2" />
        <p>Join Date: {profile.createdAt.toLocaleDateString()}</p>
        <p>Profile Views: 0</p>
        <p>Forum Posts: 0</p>
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
          <div class="rounded border p-4 hover:border-plw-red">
            <div>
              <span class="font-semibold">Medals</span>
            </div>

            <div class="flex gap-3">
              {#if profile.medals.length}
                {#each profile.medals as medal (medal.id)}
                  <img src={medal.imageURL} class="h-16 w-16" alt={medal.name} />
                {/each}
              {:else}
                <Empty.Root>
                  <Empty.Header>
                    <Empty.Media variant="icon">
                      <Medal />
                    </Empty.Media>
                    <Empty.Title>No Medals to show</Empty.Title>
                    <Empty.Description>
                      {profile.username} does not have any medals.
                    </Empty.Description>
                  </Empty.Header>
                </Empty.Root>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
