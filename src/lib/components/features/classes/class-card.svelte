<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { CardHeader, Card, CardTitle, CardContent } from '$lib/components/ui/card';
	import type { Class } from '$lib/domain/class';
	interface Props {
		class: Class;
	}
	let { class: classData }: Props = $props();
</script>

<Card>
	<CardHeader>
		<div class="flex items-center gap-2">
			<span class="size-2 rounded-full bg-primary"></span>
			<CardTitle>{classData.name}</CardTitle>
			<Badge class="ml-auto" variant={classData.isActive ? 'default' : 'destructive'}
				>{classData.isActive ? 'Ativo' : 'Inativo'}</Badge
			>
		</div>
		<div class="flex items-center gap-2">
			<Badge variant="outline">{classData.minAge} – {classData.maxAge} anos</Badge>
			<Badge variant="outline"
				>{classData.requiredMaritalStatus ? 'Casado' : 'Qualquer estado civil'}</Badge
			>
		</div>
	</CardHeader>
	<CardContent>
		{#if classData.activeEnrollmentsCount > 0}
			<p><b class="text-xl">{classData.activeEnrollmentsCount}</b> matrículas ativas</p>
		{:else}
			<p class="text-muted-foreground">Nenhuma matrícula ativa</p>
		{/if}
	</CardContent>
</Card>
