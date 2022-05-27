/** @jsx jsx */

import React, {FC} from 'react';
import {jsx, css} from '@emotion/react';
import {defaultTheme} from '@vircle/styles';
import {Button, ThemeProvider} from '@vircle/ui-component';

const App: FC<{name: string}> = ({name}) => {
	const styles = css`
		border-radius: 4px;
		border: 1px solid black;
	`;

	return (
		<ThemeProvider theme={defaultTheme}>
			<Button color="error" text="버튼입니다." />
			<div css={styles}>hello {name}</div>
		</ThemeProvider>
	);
};

export {App};
