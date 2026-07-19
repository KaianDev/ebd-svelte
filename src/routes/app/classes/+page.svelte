<script lang="ts">
	import { Header } from '$lib/components/common';
	let { data } = $props();
</script>

<Header title="Turmas" description="Gerencie as turmas e suas regras" />

{#await data.classes}
	<p>Carregando turmas…</p>
{:then { classes }}
	<ul>
		{#each classes as turma (turma.id)}
			<li>{turma.name} ({turma.minAge}–{turma.maxAge} anos)</li>
		{:else}
			<li>Nenhuma turma encontrada.</li>
		{/each}
	</ul>
{:catch}
	<p>Erro ao carregar as turmas.</p>
{/await}
