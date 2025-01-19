<script lang="ts">
	const { data } = $props();
	const { users } = data;
</script>

<main class="prose">
	<ul>
		{#each users as user (user.id)}
			<li>
				<a href="/@{user.username}" title="link to @{user.username}"
					>{user.name} (@{user.username})</a
				>
			</li>
		{/each}
	</ul>
</main>
