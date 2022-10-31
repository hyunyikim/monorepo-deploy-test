import {useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import {ThemeProvider, CssBaseline, StyledEngineProvider} from '@mui/material';
import {ThemeProvider as StylesThemeProvider} from '@mui/styles';

import getTheme from '@/assets/themes';
import RootRouter from '@/routes/RootRouter';

import '@/assets/styles/common.scss';
import {MessageDialog} from './components';

function App() {
	const theme = useMemo(() => getTheme(), []);
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<StylesThemeProvider theme={theme}>
					<CssBaseline />
					<RootRouter />
					<MessageDialog />
				</StylesThemeProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

const container = document.getElementById('app') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);
