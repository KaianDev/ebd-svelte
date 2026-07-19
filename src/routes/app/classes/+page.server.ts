import { PUBLIC_API_URL } from '$env/static/public';
import { DEPENDS_KEYS } from '$lib/constants/depends-keys.js';
import type { ListClassesResponse } from '$lib/domain/class';
import { getPagination } from '$lib/helpers/get-pagination.js';
import { error } from '@sveltejs/kit';

export async function load({ fetch, depends, url }) {
	depends(DEPENDS_KEYS.CLASSES_LIST);
	const { page, limit } = getPagination(url);

	// Não `await`: a promise é transmitida (streamed) ao browser conforme resolve.
	const classes = fetch(`${PUBLIC_API_URL}/classes?page=${page}&limit=${limit}`).then(
		async (res): Promise<ListClassesResponse> => {
			if (!res.ok) {
				error(res.status, 'Falha ao carregar as turmas');
			}
			return res.json();
		}
	);

	return { classes };
}
