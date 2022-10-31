import React from 'react';

export type MenuName =
	| 'dashboard'
	| 'guarantee'
	| 'product'
	| 'customer'
	| 'inspection'
	| 'repair'
	| 'interwork'
	| 'guarantee-setting'
	| 'profile-setting'
	| 'settlement-inspection'
	| 'settlement-repair';

export type MenuList = Menu[];

interface Menu {
	caption?: string;
	list: OneDepthMenu[];
}

interface OneDepthMenu extends MenuItem {
	menu: MenuName;
	icon: React.ReactNode;
	children?: TwoDepthMenu[];
}

interface TwoDepthMenu extends MenuItem {
	num: number;
	path: string;
}

interface MenuItem {
	num?: number;
	title: string;
	path?: string;
}

export interface CurrentMenu {
	num: number;
	menu: MenuName;
	title: string;
}
