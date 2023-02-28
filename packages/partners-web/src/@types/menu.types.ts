import React from 'react';

export type MenuList = MenuDepth1[][];

// TODO: A or B 타입 둘 중 선택
export interface MenuDepth1 {
	menu: string;
	icon: React.ReactNode;
	title: string;
	path?: string;
	emphasis?: boolean;
	children?: MenuDepth2[];
}

export interface MenuDepth2 {
	title: string;
	path: string;
	emphasis?: boolean;
}
