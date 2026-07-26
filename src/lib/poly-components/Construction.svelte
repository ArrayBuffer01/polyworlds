<script lang="ts">
  let { title = $bindable("UNDER CONSTRUCTION!") } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-white px-6">
  <div class="w-full max-w-md text-center">
    <h1 class="font-super-bouncer text-5xl tracking-tighter text-plw-red select-none sm:text-6xl">
      {title}
    </h1>

    <div class="mt-5 flex items-center gap-3">
      <div class="border-plw-accent h-px flex-1 border-t-2 border-dashed"></div>
      <span class="text-sm text-purple-300"><i class="fa fa-screwdriver-wrench"></i></span>
      <div class="border-plw-accent h-px flex-1 border-t-2 border-dashed"></div>
    </div>

    <p class="sm:text-md mt-4 text-base leading-relaxed text-gray-500">
      This page is currently under construction.
    </p>
    <p class="sm:text-md text-base leading-relaxed text-gray-500">
      We’re working hard to bring it to life. Check back soon!
    </p>
    <a
      href="/dash"
      class="mt-7 inline-flex items-center justify-center rounded-md bg-plw-red px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
    >
      <i class="fa fa-house mr-2"></i>
      Go to Dashboard
    </a>
  </div>
</div>
