<script>
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Spinner } from "$lib/components/ui/spinner";

  let loading = $state(false);
</script>

<svelte:head>
  <title>Login | Polyworlds</title>
</svelte:head>

<div class="grid h-screen grid-cols-2">
<div class="bg-plw-red flex items-center justify-center">
  <p class="text-white text-8xl tracking-tighter font-super-bouncer select-none">POLYWORLDS!</p>
</div>
<div class="flex items-center justify-center bg-accent">
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
</div>
