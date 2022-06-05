/** @jsx jsx */

import React, {FC} from 'react';
import {jsx} from '@emotion/react';
import {
	Admin,
	Resource,
	AuthProvider,
	UserIdentity,
	fetchUtils,
	Options,
} from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import '../assets/body.css';
import {AdminList} from './admin/AdminList';

const httpClient = (url: string, options: Options = {}) => {
	options.user = {
		authenticated: true,
		token: 'HELLO TOKEN',
	};
	return fetchUtils.fetchJson(url, options);
};

const identity: UserIdentity = {
	id: 'yaeger',
	fullName: 'Yaeger Moon',
	avatar: 'https://avatars.githubusercontent.com/u/60789654?s=64&v=4',
};

const authProvider: AuthProvider = {
	login: async (params) => {
		await Promise.resolve();
		return;
	},
	logout: async (params) => {
		await Promise.resolve();
		return;
	},
	checkAuth: async (params) => {
		await Promise.resolve();
		return;
	},
	checkError: async (params) => {
		await Promise.resolve();
		return;
	},
	getIdentity: () => Promise.resolve(identity),
	getPermissions: async (params) => {
		await Promise.resolve();
		return;
	},
};

const App: FC = () => {
	return (
		<Admin
			title={'Vircle back-office'}
			authProvider={authProvider}
			dataProvider={restProvider('http://localhost:3003', httpClient)}
			loginPage={<div>login</div>}
			requireAuth>
			<Resource name="admins" list={<AdminList />} />
			<Resource
				name="users"
				list={<div>user list</div>}
				create={<div>user create</div>}
			/>
		</Admin>
	);
};

export {App};
