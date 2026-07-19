import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Header from './header.svelte';

const children = createRawSnippet(() => ({
	render: () => `<span>Ação</span>`
}));

describe('header.svelte', () => {
	it('renders the title and description', async () => {
		render(Header, { title: 'Turmas', description: 'Gerencie suas turmas', children });

		await expect
			.element(page.getByRole('heading', { level: 2 }))
			.toHaveTextContent('Turmas');
		await expect
			.element(page.getByText('Gerencie suas turmas'))
			.toBeInTheDocument();
	});

	it('renders the children snippet', async () => {
		render(Header, { title: 'Turmas', description: 'Gerencie suas turmas', children });

		await expect.element(page.getByText('Ação')).toBeInTheDocument();
	});
});
