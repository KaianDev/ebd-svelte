import type { Pagination } from '$lib/domain/shared/pagination';

export interface Class {
	id: string;
	name: string;
	minAge: number;
	maxAge: number;
	requiredMaritalStatus: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	activeEnrollmentsCount: number;
}

export interface ListClassesResponse {
	classes: Class[];
	pagination: Pagination;
}
