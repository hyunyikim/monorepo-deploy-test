import {useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import {ThemeProvider, CssBaseline, StyledEngineProvider} from '@mui/material';
import {ThemeProvider as StylesThemeProvider} from '@mui/styles';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import getTheme from '@/assets/themes';
import RootRouter from '@/routes/RootRouter';

import '@/assets/styles/common.scss';
import {MessageDialog} from './components';
import ModalComponent from '@/components/common/ModalComponent';
import AmplitudeTrackingInterceptor from '@/components/common/layout/AmplitudeTrackingInterceptor';

import {initAmplitudeTracking} from '@/utils';

const queryClient = new QueryClient();

initAmplitudeTracking();

function App() {
	const theme = useMemo(() => getTheme(), []);
	return (
		<QueryClientProvider client={queryClient}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<StylesThemeProvider theme={theme}>
						<CssBaseline />
						<AmplitudeTrackingInterceptor>
							<RootRouter />
							<MessageDialog />
							<ModalComponent />
						</AmplitudeTrackingInterceptor>
					</StylesThemeProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</QueryClientProvider>
	);
}

const container = document.getElementById('app') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);
