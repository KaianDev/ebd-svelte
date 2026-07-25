<script lang="ts">
	import { Header } from '$lib/components/common';
	import { ClassCard } from '$lib/components/features/classes';
	let { data } = $props();
</script>

<Header title="Turmas" description="Gerencie as turmas e suas regras" />

{#await data.classes}
	<p>Carregando turmas…</p>
{:then { classes }}
	{console.log(classes)}
	<ul>
		{#each classes as _class (_class.id)}
			<li><ClassCard class={_class} /></li>
		{:else}
			<li>Nenhuma turma encontrada.</li>
		{/each}
	</ul>
{:catch}
	<p>Erro ao carregar as turmas.</p>
{/await}
