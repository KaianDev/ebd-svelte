import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Header from './header.svelte';


describe('header.svelte', () => {
	it('renders the title and description', async () => {
		render(Header, { title: 'Turmas', description: 'Gerencie suas turmas' });

		await expect
			.element(page.getByRole('heading', { level: 2 }))
			.toHaveTextContent('Turmas');
		await expect
			.element(page.getByText('Gerencie suas turmas'))
			.toBeInTheDocument();
	});
});
