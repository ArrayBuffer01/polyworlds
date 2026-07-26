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

<div class="grid h-screen grid-cols-2">
  <div class="flex items-center justify-center bg-plw-red">
    <p class="font-super-bouncer text-8xl tracking-tighter text-white select-none">POLYWORLDS!</p>
  </div>
  <div class="flex items-center justify-center bg-accent">
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
                placeholder="email@example.com"
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
  </div>
</div>
