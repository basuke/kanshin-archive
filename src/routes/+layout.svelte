<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<nav class="bg-gray-800 p-4 text-white">
	<ul class="flex space-x-4">
		<li class="px-4">
			<a href="/" class="hover:underline">Home</a>
		</li>
	</ul>
</nav>

<div class="container mx-auto">
	{@render children()}
</div>
