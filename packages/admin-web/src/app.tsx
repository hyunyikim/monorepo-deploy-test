import React, {FC} from 'react';
import {css, ThemeProvider} from '@emotion/react';
import {defaultTheme} from '@vircle/styles';
import {Button} from '@vircle/ui-component';

const App: FC<{name: string}> = ({name}) => {
	const styles = css`
		border-radius: 4px;
		border: 1px solid black;
	`;

	return (
		<ThemeProvider theme={defaultTheme}>
			<Button color="error" text="ohelkdslkfjjhjkalfkdjfl" />
			<div css={styles}>hello {name}</div>
		</ThemeProvider>
	);
};

export {App};
