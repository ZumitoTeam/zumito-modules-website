<script lang="ts">
	import { enhance } from '$app/forms';
	import { sileo } from 'svelte-sileo';
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Container from '$lib/components/layout/Container.svelte';

	let { data, form }: { data: PageData; form?: any } = $props();

	let profileLoading = $state(false);
	let passwordLoading = $state(false);

	const onProfileUpdate: SubmitFunction = () => {
		profileLoading = true;
		const { promise, resolve, reject } = Promise.withResolvers<void>();
		sileo.promise(promise, {
			loading: { title: 'Saving...', description: 'Updating your profile', fill: '#fafafa', styles: { title: 'text-zinc-900', description: 'text-zinc-500' } },
			success: { title: 'Profile updated', description: 'Your changes have been saved.', fill: '#f0fdf4', styles: { title: 'text-green-800', description: 'text-green-600' } },
			error: { title: 'Update failed', description: 'Please try again.', fill: '#fef2f2', styles: { title: 'text-red-800', description: 'text-red-600' } },
		});
		return async ({ result }) => {
			profileLoading = false;
			if (result.type === 'success' || result.type === 'redirect') resolve();
			else reject(new Error(result.data?.error || 'Update failed'));
		};
	};

	const onPasswordChange: SubmitFunction = () => {
		passwordLoading = true;
		const { promise, resolve, reject } = Promise.withResolvers<void>();
		sileo.promise(promise, {
			loading: { title: 'Changing password...', description: 'Please wait', fill: '#fafafa', styles: { title: 'text-zinc-900', description: 'text-zinc-500' } },
			success: { title: 'Password changed', description: 'Your password has been updated.', fill: '#f0fdf4', styles: { title: 'text-green-800', description: 'text-green-600' } },
			error: { title: 'Change failed', description: 'Current password is incorrect.', fill: '#fef2f2', styles: { title: 'text-red-800', description: 'text-red-600' } },
		});
		return async ({ result }) => {
			passwordLoading = false;
			if (result.type === 'success' || result.type === 'redirect') resolve();
			else reject(new Error(result.data?.error || 'Update failed'));
		};
	};
</script>

<svelte:head><title>Profile — Zumito Modules</title></svelte:head>

<Container class="py-12">
	<h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Profile</h1>
	<p class="mt-1 text-zinc-500">Manage your account settings and preferences.</p>

	<div class="mt-10 space-y-10">
		<!-- Profile card -->
		<section class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
			<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Public Profile</h2>
			<p class="mt-1 text-sm text-zinc-500">This information appears on your published modules.</p>

			<form method="POST" action="?/updateProfile" use:enhance={onProfileUpdate} class="mt-6 space-y-5">
				<div>
					<label for="username" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Username</label>
					<p class="mt-1 text-xs text-zinc-400">Your unique handle. Letters, numbers, and underscores.</p>
					<input id="username" name="username" required minlength={3} value={data.user.username ?? ''}
						class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
				</div>

				<div>
					<label for="image" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Avatar URL</label>
					<p class="mt-1 text-xs text-zinc-400">Link to an image for your profile avatar.</p>
					<div class="mt-2 flex items-center gap-4">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
							<img src={data.user.image ?? `https://api.dicebear.com/10.x/glyphs/svg?seed=${data.user.username ?? 'default'}`} alt="" class="h-full w-full rounded-xl object-cover" />
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

				<button type="submit" disabled={profileLoading} class="flex items-center gap-2 rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98] disabled:opacity-70 cursor-pointer">
					{#if profileLoading}<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{/if}
					{profileLoading ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</section>

		<!-- Password card -->
		<section class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
			<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Change Password</h2>
			<p class="mt-1 text-sm text-zinc-500">Use a strong password you don&apos;t use elsewhere.</p>

			<form method="POST" action="?/changePassword" use:enhance={onPasswordChange} class="mt-6 space-y-5">
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

				<button type="submit" disabled={passwordLoading} class="flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-70 cursor-pointer dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
					{#if passwordLoading}<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{/if}
					{passwordLoading ? 'Updating...' : 'Update Password'}
				</button>
			</form>
		</section>

		<!-- Account info -->
		<section class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
			<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Account</h2>
			<div class="mt-4 space-y-3 text-sm text-zinc-500">
				<div class="flex justify-between"><span>Member since</span><span class="font-medium text-zinc-700 dark:text-zinc-300">{new Date(data.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
				<div class="flex justify-between"><span>Published modules</span><span class="font-medium text-zinc-700 dark:text-zinc-300">{data.user._count.modules}</span></div>
			</div>
		</section>
	</div>
</Container>
