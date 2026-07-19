<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { BellIcon, ListIcon, PlusIcon } from 'phosphor-svelte';

	interface Props {
		title: string;
		description: string;
	}
	let { title, description }: Props = $props();
</script>

<header class="flex items-center justify-between border-b px-6 py-4">
	<div class="flex items-center gap-2">
		<Button size="icon-lg" variant="outline" class="lg:hidden">
			<ListIcon />
		</Button>
		<div>
			<h2 class="text-xl font-bold">{title}</h2>
			<p class="hidden text-sm text-muted-foreground lg:block">{description}</p>
		</div>
	</div>
	<div class="flex items-center gap-4">
		<Button size="icon-lg" variant="outline">
			<BellIcon />
		</Button>
		<div class="hidden lg:block">
			<Button>
				<PlusIcon />
				Registrar aula
			</Button>
		</div>
	</div>
</header>
