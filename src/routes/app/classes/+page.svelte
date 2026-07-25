<script lang="ts">
	import { Header } from '$lib/components/common';
	import { ClassCard, ClassesHeader } from '$lib/components/features/classes';
	let { data } = $props();
</script>

<Header title="Turmas" description="Gerencie as turmas e suas regras" />

<main class="app-container space-y-6">
	<ClassesHeader />
	{#await data.classes}
		<p>Carregando turmas…</p>
	{:then { classes }}
		<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each classes as _class (_class.id)}
				<li><ClassCard class={_class} /></li>
			{:else}
				<li>Nenhuma turma encontrada.</li>
			{/each}
		</ul>
	{:catch}
		<p>Erro ao carregar as turmas.</p>
	{/await}
</main>
