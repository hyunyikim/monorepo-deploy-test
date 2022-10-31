export type ProductListRequestSearchType = 'all' | 'name' | 'code' | 'num';

export interface ProductListRequestParam {
	categoryCode: string;
}

export interface ProductListResponse {
	idx: number;
	name: string;
	code: string;
	num: string;
	categoryCode: string;
	categoryName: string;
	brandIdx?: number;
	modelNum: string;
	material: string;
	size: string;
	weight: string;
	price: number;
	warranty: string;
	customField: any;
	productImage: string;
	partnerIdx: number;
	registrantIdx: number;
	registered: string;
	modified?: string;
	deleted: any;
	brand?: Brand;
}

export interface Brand {
	idx: number;
	name: string;
	englishName: string;
	summary: string;
	mainImage: any;
	detailImage: any;
	registrantIdx: string;
	registered: string;
}
