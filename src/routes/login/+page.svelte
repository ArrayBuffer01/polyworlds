<script>
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Spinner } from "$lib/components/ui/spinner";
  let { form } = $props();

  let loading = $state(false);
</script>

<svelte:head>
  <title>Login | Polyworlds</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
  <!-- <div
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
        <a class="p-2 pr-3 font-semibold hover:underline" href="/signup">Signup</a>
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

      <label for="password" class="text-left font-bold">Password</label>
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
  </div>-->

  <Card.Root class="-my-4 w-full max-w-sm">
    <Card.Header>
      <Card.Title>Login</Card.Title>
      <Card.Description>Fill in the fields below to login to your account.</Card.Description>
      <Card.Action>
        <Button variant="link" href="/signup">Sign up</Button>
      </Card.Action>
    </Card.Header>
    <Card.Content>
      <form
        action="?/login"
        method="POST"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
      >
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              autocomplete="off"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
            </div>
            <Input id="password" type="password" name="password" autocomplete="off" required />
          </div>
        </div>
        <Button type="submit" class="mt-3 w-full"
          >{#if loading}
            <Spinner />
          {/if}
          Login</Button
        >
      </form>
    </Card.Content>
  </Card.Root>
</div>
