<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form?: any } = $props();
</script>

<svelte:head><title>Profile — Zumito Modules</title></svelte:head>

<div class="mx-auto max-w-2xl px-4 py-16">
	<h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Profile</h1>
	<p class="mt-1 text-zinc-500">Manage your account settings and preferences.</p>

	<div class="mt-10 space-y-10">
		<!-- Profile card -->
		<section class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
			<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Public Profile</h2>
			<p class="mt-1 text-sm text-zinc-500">This information appears on your published modules.</p>

			<form method="POST" action="?/updateProfile" use:enhance class="mt-6 space-y-5">
				{#if form?.success}
					<div class="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/5 dark:text-green-400">Profile updated successfully.</div>
				{/if}
				{#if form?.error}
					<div class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">{form.error}</div>
				{/if}

				<div>
					<label for="username" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Username</label>
					<p class="mt-1 text-xs text-zinc-400">Your unique handle. Letters, numbers, and underscores only.</p>
					<input id="username" name="username" required minlength={3} value={data.user.username ?? ''}
						class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
				</div>

				<div>
					<label for="image" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Avatar URL</label>
					<p class="mt-1 text-xs text-zinc-400">Link to an image for your profile avatar.</p>
					<div class="mt-2 flex items-center gap-4">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
							{#if data.user.image}
								<img src={data.user.image} alt="" class="h-full w-full rounded-xl object-cover" />
							{:else}
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
							{/if}
						</div>
						<input id="image" name="image" placeholder="https://..." value={data.user.image ?? ''}
							class="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
					</div>
				</div>

				<div>
					<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email</label>
					<div class="mt-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
						<svg class="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
						{data.user.email}
					</div>
				</div>

				<button type="submit" class="rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Save Changes</button>
			</form>
		</section>

		<!-- Password card -->
		<section class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
			<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Change Password</h2>
			<p class="mt-1 text-sm text-zinc-500">Use a strong password you don&apos;t use elsewhere.</p>

			<form method="POST" action="?/changePassword" use:enhance class="mt-6 space-y-5">
				{#if form?.passwordChanged}
					<div class="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/5 dark:text-green-400">Password changed successfully.</div>
				{/if}

				<div>
					<label for="currentPassword" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Current Password</label>
					<input id="currentPassword" name="currentPassword" type="password" required
						class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
				</div>

				<div>
					<label for="newPassword" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">New Password</label>
					<p class="mt-1 text-xs text-zinc-400">Minimum 8 characters.</p>
					<input id="newPassword" name="newPassword" type="password" required minlength={8}
						class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
				</div>

				<button type="submit" class="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">Update Password</button>
			</form>
		</section>

		<!-- Account info card -->
		<section class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
			<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Account</h2>
			<div class="mt-4 space-y-3 text-sm text-zinc-500">
				<div class="flex justify-between">
					<span>Member since</span>
					<span class="font-medium text-zinc-700 dark:text-zinc-300">{new Date(data.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
				</div>
				<div class="flex justify-between">
					<span>Published modules</span>
					<span class="font-medium text-zinc-700 dark:text-zinc-300">{data.user._count.modules}</span>
				</div>
			</div>
		</section>
	</div>
</div>
