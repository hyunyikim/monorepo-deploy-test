export type StatisticsType = 'MONTH' | 'DAY';

export interface StatisticsRequest {
	from: string;
	to: string;
	groupBy: StatisticsType;
	groupSize: number;
}

export type StatisticsResponse = Statistics[];

export interface Statistics {
	reference: Reference;
	total: number;
	ready: number;
	requested: number;
	confirmed: number;
	completed: number;
	canceled: number;
}

export interface Reference {
	from: string;
	to: string;
}
