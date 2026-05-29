<div class="flex h-screen items-center justify-center">
	<div
		class="border-neutral-250 flex h-auto w-sm flex-col space-y-3 rounded-md border bg-white p-5 pl-6"
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

		<form action="#">
			<label for="email" class="text-left font-bold">Email</label>
			<input
				type="text"
				id="email"
				name="email"
				placeholder="email@example.com"
				class="border-neutral-250 mt-1 mb-6 w-full rounded-sm border-1 p-1 pl-3"
			/>
			<label for="pass" class="text-left font-bold">Password</label>
			<input
				type="password"
				id="pass"
				name="pass"
				class="border-neutral-250 mt-1 mb-8 w-full rounded-sm border-1 p-1 pl-3"
			/>
			<input
				type="submit"
				value="Login"
				class="bg-plw-red -mb-1 w-full rounded-md p-1.5 text-white"
			/>
		</form>

		<button
			class="text-plw-red hover:bg-plw-gray w-full rounded-md bg-transparent p-1.5 transition duration-200"
			>Forgot your password?</button
		>
	</div>
</div>
