<script lang="ts">
  import type { Feed, User } from "../../types/User";

  export interface UserFeedProps {
    user: User;
    feed: Feed;
  }
  let { user, feed }: UserFeedProps = $props();
</script>

<div class="overflow-hidden rounded border hover:border-plw-red">
  <div class="px-5 pt-4">
    <div>
      <a href="/users/{user.id}">
        <div class="flex gap-2">
          <img
            alt="Profile"
            src="/profile.png"
            class="h-10 w-10 rounded-full border border-plw-gray"
          />
          <div class="font-semibold">
            <span class="hover:underline">{user.username}</span>
          </div>
          <div>
            <span class="text-sm">{feed.createdAt.toLocaleTimeString()}</span>
          </div>
        </div>
      </a>
    </div>
    <div class="pt-2 pb-2">
      {feed.content}
    </div>
  </div>
</div>
