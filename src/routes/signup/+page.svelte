<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  interface FormErrors {
    username: string[];
    email: string[];
    password: string[];
  }

  let { form } = $props();
  let loading = $state(false);

  let fieldErrors = $state<FormErrors>({ username: [], email: [], password: [] });

  function clearErrors() {
    fieldErrors.username = [];
    fieldErrors.email = [];
    fieldErrors.password = [];
  }

  $effect(() => {
    if (form?.fieldErrors?.properties?.username?.errors.length) {
      fieldErrors.username = form?.fieldErrors?.properties?.username?.errors;
    }

    if (form?.fieldErrors?.properties?.email?.errors.length) {
      fieldErrors.email = form?.fieldErrors?.properties?.email?.errors;
    }

    if (form?.fieldErrors?.properties?.password?.errors.length) {
      fieldErrors.password = form?.fieldErrors?.properties?.password?.errors;
    }
  });
</script>

<svelte:head>
  <title>Signup | Polyworlds</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
  <Card.Root class="-my-4 w-full max-w-sm">
    <Card.Header>
      <Card.Title>Create an account</Card.Title>
      <Card.Description>Fill in the fields below to create an account.</Card.Description>
      <Card.Action>
        <Button variant="link" href="/login">Login</Button>
      </Card.Action>
    </Card.Header>
    <Card.Content>
      <form
        action="?/signup"
        method="POST"
        use:enhance={() => {
          clearErrors();
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
              aria-invalid={fieldErrors.username.length > 0}
              autocomplete="off"
              required
            />
            {#if fieldErrors.username.length > 0}
              {#each fieldErrors.username as err, index (index)}
                <p class="text-sm text-destructive">
                  {err}
                </p>
              {/each}
            {/if}
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              aria-invalid={fieldErrors.email.length > 0}
              placeholder="email@yeah.com"
              autocomplete="off"
              name="email"
              required
            />
            {#if fieldErrors.email.length > 0}
              {#each fieldErrors.email as err, index (index)}
                <p class="text-sm text-destructive">
                  {err}
                </p>
              {/each}
            {/if}
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              aria-invalid={fieldErrors.password.length > 0}
              name="password"
              autocomplete="off"
              required
            />
            {#if fieldErrors.password.length > 0}
              {#each fieldErrors.password as err, index (index)}
                <p class="text-sm text-destructive">
                  {err}
                </p>
              {/each}
            {/if}
          </div>
        </div>
        <Button type="submit" class="mt-3 w-full"
          >{#if loading}
            <Spinner />
          {/if}
          Sign Up</Button
        >
      </form>
    </Card.Content>
  </Card.Root>

  <!-- <div
    class="flex h-auto w-sm flex-col space-y-3 rounded-md border border-neutral-250 bg-white p-5 pl-6"
  >
    <div class="flex w-full">
      <div class="h-20 w-2/3">
        <p class="font-bold">Create an account</p>
        <p class="text-[15px] text-neutral-400">
          Fill in the form below to create your account and start exploring Polyworlds.
        </p>
      </div>
      <div class="flex w-1/3 items-start justify-end">
        <a class="p-2 pr-3 font-semibold hover:underline" href="/login">Login</a>
      </div>
    </div>

    <form
      action="?/signup"
      method="POST"
      use:enhance={() => {
        clearErrors();
        loading = true;
        return async ({ update }) => {
          await update();
          loading = false;
        };
      }}
    >
      <label for="username" class="text-left font-bold">Username</label>
      <Input
        type="text"
        id="username"
        name="username"
        placeholder="Username here..."
        aria-invalid={fieldErrors.username.length > 0}
        class="mt-1 mb-1 w-full rounded-sm border border-neutral-250 p-1 pl-3"
      />
      {#if fieldErrors.username.length > 0}
        {#each fieldErrors.username as err, index (index)}
          <p class="text-sm text-destructive">
            {err}
          </p>
        {/each}
      {/if}
      <label for="email" class="text-left font-bold">Email</label>
      <Input
        type="email"
        id="email"
        name="email"
        placeholder="Email here..."
        aria-invalid={fieldErrors.email.length > 0}
        class="mb-1 w-full rounded-sm border border-neutral-250 p-1 pl-3"
      />
      {#if fieldErrors.email.length > 0}
        {#each fieldErrors.email as err, index (index)}
          <p class="text-sm text-destructive">
            {err}
          </p>
        {/each}
      {/if}
      <label for="password" class="text-left font-bold">Password</label>
      <Input
        type="password"
        id="password"
        name="password"
        placeholder="Password here..."
        aria-invalid={fieldErrors.password.length > 0}
        class="mb-1 w-full rounded-sm border border-neutral-250 p-1 pl-3"
      />
      {#if fieldErrors.password.length > 0}
        {#each fieldErrors.password as err, index (index)}
          <p class="text-sm text-destructive">
            {err}
          </p>
        {/each}
      {/if}
      <Button type="submit" class="w-full bg-plw-red p-1.5 text-white" disabled={loading}>
        {#if loading}
          <Spinner />
        {/if}
        Sign Up
      </Button>
    </form>
  </div>-->
</div>
