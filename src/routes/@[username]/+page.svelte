<script lang="ts">
	import { itemUrl } from '$lib/data.js';

	const { data } = $props();
	const { user, items } = data;
</script>

<main class="prose">
	<h1>{user.name} (@{user.username})</h1>
	<p>{user.bio}</p>

	{#each items as item (item.id)}
		<li><a href={itemUrl(item)}>{item.title}</a></li>
	{/each}
</main>
