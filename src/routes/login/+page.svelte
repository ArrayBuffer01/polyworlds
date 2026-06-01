<script>
  import { enhance } from "$app/forms";
  import { invalidate, invalidateAll } from "$app/navigation";
  let { form } = $props();

  let loading = $state(false);
</script>

<svelte:head>
  <title>Login | Polyworlds</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
  <div
    class="flex h-auto w-sm flex-col space-y-3 rounded-md border border-neutral-250 bg-white p-5 pl-6"
  >
    <div class="flex w-full">
      <div class="h-20 w-2/3">
        <p class="font-bold">Login to your account</p>
        <p class="text-[15px] text-neutral-400">
          Enter your account details below to login to your account
        </p>
      </div>
      <div class="flex w-1/3 items-start justify-end">
        <a class="p-2 pr-3 font-semibold hover:underline" href="#">Signup</a>
      </div>
    </div>

    <form
      action="?/login"
      method="POST"
      use:enhance={() => {
        loading = true;
        return async ({ update, result }) => {
          await update();
          loading = false;
        };
      }}
    >
      <label for="username" class="text-left font-bold">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Username here..."
        class="mt-1 mb-6 w-full rounded-sm border-1 border-neutral-250 p-1 pl-3"
      />
      <label for="pass" class="text-left font-bold">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password here..."
        class="mt-1 mb-8 w-full rounded-sm border-1 border-neutral-250 p-1 pl-3"
      />
      <input
        type="submit"
        value="Login"
        class="-mb-1 w-full rounded-md bg-plw-red p-1.5 text-white"
        disabled={loading}
      />
    </form>

    <button
      class="w-full rounded-md bg-transparent p-1.5 text-plw-red transition duration-200 hover:bg-plw-gray"
      >Forgot your password?</button
    >
  </div>
</div>
