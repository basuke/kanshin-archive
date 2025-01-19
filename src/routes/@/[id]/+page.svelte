<script lang="ts">
	import { itemUrl, userUrl } from '$lib/data.js';

	const { data } = $props();
	const { user, item } = data;
</script>

<main class="prose">
	<h1>{item.title}</h1>
	<h2><a href={userUrl(user)}>@{user.username}</a></h2>
	<p>{item.body}</p>
</main>
