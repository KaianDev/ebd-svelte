const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function getPagination(url: URL) {
	const searchParams = url.searchParams;
	const page = String(searchParams.get('page') || DEFAULT_PAGE);
	const limit = String(searchParams.get('limit') || DEFAULT_LIMIT);
	return {
		page,
		limit
	};
}
