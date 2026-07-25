<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { InputGroup, InputGroupAddon, InputGroupInput } from '$lib/components/ui/input-group';
	import { MagnifyingGlassIcon, PlusIcon } from 'phosphor-svelte';
</script>

<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
	<InputGroup class="flex-1">
		<InputGroupAddon>
			<MagnifyingGlassIcon />
		</InputGroupAddon>
		<InputGroupInput placeholder="Buscar turma..." />
	</InputGroup>

	<div class="flex items-center gap-2">
		<Button variant="outline-active">Todas</Button>
		<Button variant="outline">Ativas</Button>
		<Button variant="outline">Inativas</Button>
	</div>

	<Button>
		<PlusIcon />
		Nova turma
	</Button>
</div>
