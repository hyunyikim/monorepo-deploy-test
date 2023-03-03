import React from 'react';

export type Menu =
	| 'dashboard'
	| 'guarantee'
	| 'product'
	| 'customer'
	| 'repair'
	| 'interwork'
	| 'payment';

export type MenuList = MenuDepth1[][];

// TODO: A or B 타입 둘 중 선택
export interface MenuDepth1 {
	menu: Menu;
	icon: React.ReactNode;
	title: string;
	event?: [string, string]; // amplitude event
	path?: string;
	emphasis?: boolean;
	children?: MenuDepth2[];
}

export interface MenuDepth2 {
	title: string;
	path: string;
	emphasis?: boolean;
	event?: [string, string]; // amplitude event
}
