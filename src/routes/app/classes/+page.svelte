<script>
	import { AppHeader } from '$lib/components/common';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'phosphor-svelte';
</script>

<AppHeader title="Turmas" description="Gerencie as turmas e suas regras">
	<Button size="lg">
		<PlusIcon />
		Nova Turma
	</Button>
</AppHeader>
