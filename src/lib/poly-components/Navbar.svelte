<nav class="bg-plw-white fixed flex h-15 w-screen justify-center">
	<div class="flex h-full w-300 items-center justify-between text-white">
		<!-- Aligned left -->
		<div class="flex items-center">
			<a href="#" class="flex cursor-pointer items-center p-1">
				<img src="logo.png" class="h-15 w-15 select-none" />
				<h2 class="text-plw-black ml-5 text-xl font-extrabold select-none">Polyworlds</h2>
			</a>
			<span class="w-8"></span>

			<!-- Main nav buttons -->
			<div class="flex h-full">
				<button
					class="bg-plw-white text-plw-black hover:bg-neutral-150 flex h-15 cursor-pointer items-center px-4 font-semibold transition duration-200 select-none"
				>
					<i class="fa fa-gamepad"></i><span class="ml-2">Worlds</span>
				</button>
				<button
					class="bg-plw-white text-plw-black hover:bg-neutral-150 flex h-15 cursor-pointer items-center px-4 font-semibold transition duration-200 select-none"
				>
					<i class="fa fa-home"></i><span class="ml-2">Groups</span>
				</button>
				<button
					class="bg-plw-white text-plw-black hover:bg-neutral-150 flex h-15 cursor-pointer items-center px-4 font-semibold transition duration-200 select-none"
				>
					<i class="fa fa-shopping-basket"></i><span class="ml-2">Catalog</span>
				</button>
				<button
					class="bg-plw-white text-plw-black hover:bg-neutral-150 flex h-15 cursor-pointer items-center px-4 font-semibold transition duration-200 select-none"
				>
					<i class="fa fa-group"></i><span class="ml-2">Forums</span>
				</button>
			</div>
		</div>

		<!-- Aligned right -->
		<div class="flex items-center">
			<p class="text-plw-black font-semibold">
				<i class="fa fa-fire text-amber-500"></i>
				<span class="ml-2 text-amber-500 select-none">0</span>
			</p>
			<span class="w-4"></span>
			<p class="text-plw-black font-semibold">
				<i class="fa fa-coins text-green-400"></i>
				<span class="ml-2 text-green-400 select-none">0</span>
			</p>
			<span class="w-3"></span>

			<!-- User button thingy -->
			<div class="relative" id="dropdown-wrapper">
				<button
					id="dropdown-button"
					class="text-plw-black hover:bg-neutral-150 flex h-15 cursor-pointer items-center p-3 font-semibold transition duration-200 select-none"
				>
					<span>Username</span>
					<img src="profile.png" class="border-neutral-250 ml-2 h-10 w-10 rounded-full border" />
				</button>

				<!-- Dropdown menu -->
				<div
					id="dropdown-menu"
					class="border-neutral-250 absolute top-full right-0 z-50 mt-2 hidden w-48 -translate-y-2 scale-100 transform rounded-lg border bg-white shadow-lg transition-transform duration-150"
				>
					<ul class="text-plw-black text-sm">
						<li
							class="text-plw-black mt-1 cursor-pointer px-4 py-2 font-semibold transition duration-100 select-none hover:bg-zinc-100"
						>
							Profile
						</li>
						<li
							class="text-plw-black cursor-pointer px-4 py-2 font-semibold transition duration-100 select-none hover:bg-zinc-100"
						>
							Settings
						</li>
						<hr class="m-2 mr-5 ml-5 justify-center text-gray-200" />
						<li
							class="text-plw-red mb-1 cursor-pointer px-4 py-2 font-semibold transition duration-100 select-none hover:bg-rose-50"
						>
							Logout
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</nav>
