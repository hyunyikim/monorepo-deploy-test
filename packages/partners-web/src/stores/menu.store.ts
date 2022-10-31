import create from 'zustand';

import {MenuList, PartnershipViewMenuYN, CurrentMenu} from '@/@types';
import {matchViewMenu, getCurrentMenu} from '@/data';

export const VIEW_MENU_KEY = 'viewMenu';

interface OpenMenuProps {
	open: boolean;
	setOpen: (value: boolean) => void;
}

interface ViewMenuStroe {
	viewMenu: PartnershipViewMenuYN | null;
	setViewMenu: (value: PartnershipViewMenuYN) => void;
	menuList: () => MenuList | null;
	currentMenu: () => CurrentMenu;
}

interface BackgroundColorStore {
	backgroundColor: string | null;
	setBackgroundColor: (value: string) => void;
	resetBackgroundColor: () => void;
}

export const useOpenMenuStore = create<OpenMenuProps>((set) => ({
	open: true,
	setOpen: (value: boolean) => set({open: value}),
}));

export const useViewMenuStore = create<ViewMenuStroe>((set, get) => ({
	viewMenu: JSON.parse(
		localStorage.getItem(VIEW_MENU_KEY) ?? 'null'
	) as PartnershipViewMenuYN | null,
	setViewMenu: (value) =>
		set({
			viewMenu: value,
		}),
	menuList: () => matchViewMenu(get().viewMenu),
	currentMenu: () => getCurrentMenu(),
}));

export const useBackgroundColorStore = create<BackgroundColorStore>((set) => ({
	backgroundColor: null,
	setBackgroundColor: (value: string) => set({backgroundColor: value}),
	resetBackgroundColor: () => set({backgroundColor: null}),
}));
